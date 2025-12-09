from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class DocumentCategory(str, Enum):
    """Categorias de documentos do condomínio"""
    REGIMENTOS = "regimentos"
    ATAS = "atas"
    COMUNICADOS = "comunicados"
    RELATORIOS = "relatorios"
    OUTROS = "outros"

class FileUploadResult(BaseModel):
    """Resultado do upload de um arquivo individual"""
    filename: str
    status: str  # 'success' | 'failed'
    document_id: Optional[str] = None
    error: Optional[str] = None
    message: str

class DocumentUploadResponse(BaseModel):
    """Resposta do upload de múltiplos arquivos"""
    total_files: int
    successful: int
    failed: int
    results: List[FileUploadResult]


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    status: str
    category: DocumentCategory
    tenant_id: str

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
    total: int


class ChatRequest(BaseModel):
    question: str
    max_chunks: int = 5  # Número de chunks a recuperar


class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]  # Lista de documentos citados
    confidence: Optional[float] = None
