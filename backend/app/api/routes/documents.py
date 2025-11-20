from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import os
import shutil

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.models.document import Document
from app.schemas.document import DocumentUploadResponse, DocumentListResponse, DocumentResponse
from app.services.document_service import DocumentProcessor

router = APIRouter()
processor = DocumentProcessor()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Upload de PDF de regimento (Admin only)"""

    # Validar tipo de arquivo
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Criar registro no banco
    document = Document(
        filename=file.filename,
        file_type="pdf",
        file_size=0,  # Será atualizado
        tenant_id=current_user.tenant_id,
        uploaded_by=current_user.id,
        status="uploading"
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)

    # Salvar arquivo
    file_path = os.path.join(UPLOAD_DIR, f"{document.id}.pdf")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = os.path.getsize(file_path)
        document.file_size = file_size
        await db.commit()

        # Processar em background
        background_tasks.add_task(processor.process_document, db, document, file_path)

        return DocumentUploadResponse(
            id=document.id,
            filename=document.filename,
            status="processing",
            message="Document uploaded successfully. Processing in background."
        )

    except Exception as e:
        document.status = "failed"
        await db.commit()
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar documentos do condomínio"""
    result = await db.execute(
        select(Document).where(Document.tenant_id == current_user.tenant_id)
    )
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
        raise HTTPException(status_code=404, detail="Document not found")

    return document
