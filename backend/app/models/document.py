from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, func, Enum
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.core.database import Base
import uuid
import enum

def generate_uuid():
    return str(uuid.uuid4())

class DocumentCategory(str, enum.Enum):
    """Categorias de documentos do condomínio"""
    REGIMENTOS = "regimentos"
    ATAS = "atas"
    COMUNICADOS = "comunicados"
    RELATORIOS = "relatorios"
    OUTROS = "outros"

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    file_type = Column(String, default="pdf")
    file_size = Column(Integer)  # bytes
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="processing")  # processing, completed, failed
    category = Column(Enum(DocumentCategory, name='document_category', values_callable=lambda x: [e.value for e in x]), nullable=False, default=DocumentCategory.OUTROS)

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

    uploaded_by = Column(String, ForeignKey("users.id"), nullable=False)
    uploader = relationship("User")

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, default=generate_uuid)
    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)  # Ordem do chunk no documento
    page_number = Column(Integer)  # Página de origem (se disponível)

    # Vector embedding (3072 dimensões para Gemini gemini-embedding-001)
    embedding = Column(Vector(3072))

    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    document = relationship("Document", back_populates="chunks")

    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
