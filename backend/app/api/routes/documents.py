from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging
import os

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.models.document import Document, DocumentCategory
from app.repositories.document import DocumentRepository
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentResponse,
    FileUploadResult
)
from app.schemas.pagination import PagedResponse
from app.services.document_service import DocumentProcessor
from app.services.file_validator import FileValidator
from app.exceptions import NotFoundError

logger = logging.getLogger(__name__)

router = APIRouter()

_processor = DocumentProcessor()
_validator = FileValidator()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_processor() -> DocumentProcessor:
    return _processor


def get_validator() -> FileValidator:
    return _validator


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    category: DocumentCategory = Query(DocumentCategory.OUTROS),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    processor: DocumentProcessor = Depends(get_processor),
    validator: FileValidator = Depends(get_validator),
):
    if not files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo foi enviado")

    repo = DocumentRepository(db)
    results: List[FileUploadResult] = []
    successful = 0
    failed = 0

    for file in files:
        try:
            content = await file.read()
            file_size = len(content)

            is_valid, error = validator.validate_file_size(file_size)
            if not is_valid:
                results.append(FileUploadResult(filename=file.filename, status="failed", error=error, message=f"Validação falhou: {error}"))
                failed += 1
                continue

            is_valid, error = validator.validate_file_extension(file.filename)
            if not is_valid:
                results.append(FileUploadResult(filename=file.filename, status="failed", error=error, message=f"Validação falhou: {error}"))
                failed += 1
                continue

            is_valid, error = await validator.validate_mime_type(content, file.filename)
            if not is_valid:
                results.append(FileUploadResult(filename=file.filename, status="failed", error=error, message=f"Validação falhou: {error}"))
                failed += 1
                continue

            ext = file.filename.lower().rsplit(".", 1)[-1] if "." in file.filename else "unknown"

            document = Document(
                filename=file.filename,
                file_type=ext,
                file_size=file_size,
                category=category,
                tenant_id=current_user.tenant_id,
                uploaded_by=current_user.id,
                status="uploading",
            )
            document = await repo.save(document)

            file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{ext}")
            with open(file_path, "wb") as buffer:
                buffer.write(content)

            is_valid, error = await validator.validate_file_integrity(file_path, ext)
            if not is_valid:
                os.remove(file_path)
                document.status = "failed"
                await db.commit()
                results.append(FileUploadResult(filename=file.filename, status="failed", document_id=document.id, error=error, message=f"Validação de integridade falhou: {error}"))
                failed += 1
                continue

            document.status = "processing"
            await db.commit()
            background_tasks.add_task(processor.process_document, db, document, file_path)

            results.append(FileUploadResult(filename=file.filename, status="success", document_id=document.id, message="Arquivo enviado com sucesso. Processamento em andamento."))
            successful += 1

        except Exception as e:
            results.append(FileUploadResult(filename=file.filename, status="failed", error=str(e), message=f"Erro inesperado: {str(e)}"))
            failed += 1

    return DocumentUploadResponse(total_files=len(files), successful=successful, failed=failed, results=results)


@router.get("/", response_model=PagedResponse[DocumentResponse])
async def list_documents(
    category: Optional[DocumentCategory] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = DocumentRepository(db)
    documents, total = await repo.list_with_filters(
        current_user.tenant_id, page, page_size, category, status
    )
    return PagedResponse.build(items=documents, total=total, page=page, page_size=page_size)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = await DocumentRepository(db).get_by_id(document_id, current_user.tenant_id)
    if not document:
        raise NotFoundError("Documento não encontrado")
    return document


@router.get("/{document_id}/download")
async def download_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = await DocumentRepository(db).get_by_id(document_id, current_user.tenant_id)
    if not document:
        raise NotFoundError("Documento não encontrado")

    file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{document.file_type}")
    if not os.path.exists(file_path):
        raise NotFoundError("Arquivo não encontrado no servidor")

    return FileResponse(path=file_path, filename=document.filename, media_type="application/octet-stream")


@router.post("/{document_id}/reprocess")
async def reprocess_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    processor: DocumentProcessor = Depends(get_processor),
):
    repo = DocumentRepository(db)
    document = await repo.get_by_id(document_id, current_user.tenant_id)
    if not document:
        raise NotFoundError("Documento não encontrado")

    file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{document.file_type}")
    if not os.path.exists(file_path):
        raise NotFoundError("Arquivo não encontrado no servidor. Re-upload necessário.")

    await repo.delete_chunks(document_id)
    document.status = "processing"
    await db.commit()

    logger.info(f"Reprocessing document {document_id} ({document.filename})")
    background_tasks.add_task(processor.process_document, db, document, file_path)

    return {"message": f"Reprocessamento do documento '{document.filename}' iniciado.", "document_id": document_id, "status": "processing"}


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    repo = DocumentRepository(db)
    document = await repo.get_by_id(document_id, current_user.tenant_id)
    if not document:
        raise NotFoundError("Documento não encontrado")

    file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{document.file_type}")
    if os.path.exists(file_path):
        os.remove(file_path)

    await repo.delete(document)
    return None
