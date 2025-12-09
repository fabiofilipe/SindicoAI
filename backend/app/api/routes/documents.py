from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import os

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.models.document import Document, DocumentCategory
from app.schemas.document import (
    DocumentUploadResponse,
    DocumentListResponse,
    DocumentResponse,
    FileUploadResult
)
from app.services.document_service import DocumentProcessor
from app.services.file_validator import FileValidator

router = APIRouter()
processor = DocumentProcessor()
validator = FileValidator()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    category: DocumentCategory = Query(DocumentCategory.OUTROS),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Upload de múltiplos documentos (Admin only).

    Tipos suportados: PDF, XLSX, XLS
    Tamanho máximo: 10MB por arquivo
    """

    if not files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo foi enviado")

    results: List[FileUploadResult] = []
    successful = 0
    failed = 0

    for file in files:
        try:
            # 1. Ler conteúdo do arquivo
            content = await file.read()
            file_size = len(content)

            # 2. Validação: Tamanho
            is_valid, error = validator.validate_file_size(file_size)
            if not is_valid:
                results.append(FileUploadResult(
                    filename=file.filename,
                    status="failed",
                    error=error,
                    message=f"Validação falhou: {error}"
                ))
                failed += 1
                continue

            # 3. Validação: Extensão
            is_valid, error = validator.validate_file_extension(file.filename)
            if not is_valid:
                results.append(FileUploadResult(
                    filename=file.filename,
                    status="failed",
                    error=error,
                    message=f"Validação falhou: {error}"
                ))
                failed += 1
                continue

            # 4. Validação: MIME type (anti-spoofing)
            is_valid, error = await validator.validate_mime_type(content, file.filename)
            if not is_valid:
                results.append(FileUploadResult(
                    filename=file.filename,
                    status="failed",
                    error=error,
                    message=f"Validação falhou: {error}"
                ))
                failed += 1
                continue

            # 5. Determinar tipo de arquivo
            ext = file.filename.lower().rsplit('.', 1)[-1] if '.' in file.filename else 'unknown'

            # 6. Criar registro no banco
            document = Document(
                filename=file.filename,
                file_type=ext,
                file_size=file_size,
                category=category,
                tenant_id=current_user.tenant_id,
                uploaded_by=current_user.id,
                status="uploading"
            )
            db.add(document)
            await db.commit()
            await db.refresh(document)

            # 7. Salvar arquivo no disco
            file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{ext}")

            with open(file_path, "wb") as buffer:
                buffer.write(content)

            # 8. Validação: Integridade do arquivo
            is_valid, error = await validator.validate_file_integrity(file_path, ext)
            if not is_valid:
                # Limpar arquivo corrompido
                os.remove(file_path)
                document.status = "failed"
                await db.commit()

                results.append(FileUploadResult(
                    filename=file.filename,
                    status="failed",
                    document_id=document.id,
                    error=error,
                    message=f"Validação de integridade falhou: {error}"
                ))
                failed += 1
                continue

            # 9. Agendar processamento em background
            document.status = "processing"
            await db.commit()

            background_tasks.add_task(processor.process_document, db, document, file_path)

            results.append(FileUploadResult(
                filename=file.filename,
                status="success",
                document_id=document.id,
                message="Arquivo enviado com sucesso. Processamento em andamento."
            ))
            successful += 1

        except Exception as e:
            results.append(FileUploadResult(
                filename=file.filename,
                status="failed",
                error=str(e),
                message=f"Erro inesperado: {str(e)}"
            ))
            failed += 1

    return DocumentUploadResponse(
        total_files=len(files),
        successful=successful,
        failed=failed,
        results=results
    )


@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    category: Optional[DocumentCategory] = Query(None, description="Filtrar por categoria"),
    status: Optional[str] = Query(None, description="Filtrar por status (processing, completed, failed)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar documentos do condomínio com filtros opcionais"""

    query = select(Document).where(Document.tenant_id == current_user.tenant_id)

    # Aplicar filtros
    if category:
        query = query.where(Document.category == category)
    if status:
        query = query.where(Document.status == status)

    # Ordenar por data de upload (mais recentes primeiro)
    query = query.order_by(Document.upload_date.desc())

    result = await db.execute(query)
    documents = result.scalars().all()

    return DocumentListResponse(
        documents=documents,
        total=len(documents)
    )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um documento específico"""
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.tenant_id == current_user.tenant_id
        )
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    return document


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Deletar documento (Admin only)"""

    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.tenant_id == current_user.tenant_id
        )
    )
    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    # Deletar arquivo físico
    ext = document.file_type
    file_path = os.path.join(UPLOAD_DIR, f"{document.id}.{ext}")
    if os.path.exists(file_path):
        os.remove(file_path)

    # Deletar do banco (cascade para chunks)
    await db.delete(document)
    await db.commit()

    return None
