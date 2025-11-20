from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    status: str
    message: str

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    file_size: int
    upload_date: datetime
    status: str
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
