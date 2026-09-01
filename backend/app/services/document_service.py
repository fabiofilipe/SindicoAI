import asyncio
import logging

import pandas as pd
import pdfplumber
from agno.knowledge.chunking.recursive import RecursiveChunking
from agno.knowledge.document.base import Document as AgnoDocument
from agno.knowledge.embedder.google import GeminiEmbedder

from app.core.config import settings
from app.core.database import get_db_session
from app.repositories.document import DocumentRepository

logger = logging.getLogger(__name__)


class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveChunking(
            chunk_size=settings.CHUNK_SIZE,
            overlap=settings.CHUNK_OVERLAP,
        )
        self.embedder = GeminiEmbedder(
            id=settings.GEMINI_EMBEDDING_MODEL,
            task_type="RETRIEVAL_DOCUMENT",
            dimensions=settings.GEMINI_EMBEDDING_DIMENSIONS,
            api_key=settings.GOOGLE_API_KEY,
        )

    async def extract_text_from_pdf(self, pdf_path: str) -> dict:
        """Extrai texto de PDF com informação de páginas"""

        def _extract(path: str) -> dict:
            text_by_page = {}
            with pdfplumber.open(path) as pdf:
                for page_num, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text()
                    if text:
                        text_by_page[page_num] = text
            return text_by_page

        try:
            text_by_page = await asyncio.to_thread(_extract, pdf_path)
            logger.info(f"Extracted text from {len(text_by_page)} pages")
            return text_by_page

        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            raise

    async def extract_text_from_excel(self, excel_path: str) -> dict:
        """Extrai texto de planilhas Excel (XLSX/XLS) preservando estrutura"""

        def _extract(path: str) -> dict:
            text_by_sheet = {}
            excel_file = pd.ExcelFile(path)

            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)

                text_parts = []
                text_parts.append(f"Planilha: {sheet_name}\n")
                text_parts.append("=" * 50 + "\n\n")

                headers = " | ".join(str(col) for col in df.columns)
                text_parts.append(f"Colunas: {headers}\n\n")

                for idx, row in df.iterrows():
                    row_text = " | ".join(
                        f"{col}: {val}" for col, val in row.items() if pd.notna(val)
                    )
                    if row_text:
                        text_parts.append(f"Linha {idx + 1}: {row_text}\n")

                text_by_sheet[sheet_name] = "\n".join(text_parts)

            return text_by_sheet

        try:
            text_by_sheet = await asyncio.to_thread(_extract, excel_path)
            logger.info(f"Extracted text from {len(text_by_sheet)} sheets")
            return text_by_sheet

        except Exception as e:
            logger.error(f"Error extracting Excel text: {e}")
            raise

    def chunk_text(self, text_by_section: dict, section_type: str = "page") -> list[dict]:
        """
        Divide texto em chunks mantendo referência de seção.

        Args:
            text_by_section: Dicionário com texto por seção (páginas ou planilhas)
            section_type: Tipo de seção - 'page' para PDFs, 'sheet' para Excel

        Returns:
            Lista de dicionários com chunks e metadados
        """
        chunks: list[dict] = []

        for section_id, text in text_by_section.items():
            if not text or not text.strip():
                continue

            section_document = AgnoDocument(
                content=text,
                name=f"{section_type}-{section_id}",
            )
            section_chunks = self.text_splitter.chunk(section_document)

            for chunk_document in section_chunks:
                chunk_data = {
                    "text": chunk_document.content,
                    "chunk_index": len(chunks)
                }

                # Add section-specific metadata
                if section_type == "page":
                    chunk_data["page_number"] = section_id
                    chunk_data["sheet_name"] = None
                elif section_type == "sheet":
                    chunk_data["page_number"] = None
                    chunk_data["sheet_name"] = str(section_id)

                chunks.append(chunk_data)

        logger.info(f"Created {len(chunks)} chunks from {len(text_by_section)} {section_type}s")
        return chunks

    async def generate_embedding(self, text: str) -> list[float]:
        """Gera embedding de documento usando o Gemini via Agno."""
        try:
            embedding = await asyncio.to_thread(
                self.embedder.get_embedding,
                text,
            )
            if len(embedding) != settings.GEMINI_EMBEDDING_DIMENSIONS:
                raise ValueError(
                    "Embedding dimension mismatch: "
                    f"expected {settings.GEMINI_EMBEDDING_DIMENSIONS}, got {len(embedding)}"
                )
            return embedding

        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    async def process_document(self, document_id: str, file_path: str):
        """
        Pipeline completo de processamento para PDFs e Excel.

        Args:
            db: Sessão do banco de dados
            document: Modelo do documento
            file_path: Caminho do arquivo salvo
        """
        try:
            async with get_db_session() as db:
                repo = DocumentRepository(db)
                document = await repo.get_by_id_any_tenant(document_id)
                if not document:
                    raise ValueError(f"Document {document_id} not found")

                document.status = "extracting"  # type: ignore[assignment]
                await db.commit()

                if document.file_type == "pdf":
                    text_by_section = await self.extract_text_from_pdf(file_path)
                    section_type = "page"
                    logger.info(f"Processing PDF: {document.filename}")

                elif document.file_type in ["xlsx", "xls"]:
                    text_by_section = await self.extract_text_from_excel(file_path)
                    section_type = "sheet"
                    logger.info(f"Processing Excel: {document.filename}")

                else:
                    from app.exceptions import UnprocessableError
                    raise UnprocessableError(f"Tipo de arquivo não suportado: {document.file_type}")

                document.status = "chunking"  # type: ignore[assignment]
                await db.commit()

                chunks = self.chunk_text(text_by_section, section_type)

                document.status = "embedding"  # type: ignore[assignment]
                await db.commit()

                for chunk_data in chunks:
                    embedding = await self.generate_embedding(chunk_data["text"])

                    await repo.create_chunk(
                        chunk_text=chunk_data["text"],
                        chunk_index=chunk_data["chunk_index"],
                        page_number=chunk_data["page_number"],
                        embedding=embedding,
                        document_id=document.id,
                        tenant_id=document.tenant_id,
                    )

                document.status = "completed"  # type: ignore[assignment]
                await db.commit()

                logger.info(f"Document {document.id} processed successfully")

        except Exception as e:
            async with get_db_session() as db:
                repo = DocumentRepository(db)
                document = await repo.get_by_id_any_tenant(document_id)
                if document:
                    document.status = "failed"  # type: ignore[assignment]
                    await db.commit()
            logger.error(f"Error processing document {document_id}: {e}")
            raise
