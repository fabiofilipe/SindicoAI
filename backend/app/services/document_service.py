import pdfplumber
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, DocumentChunk
from app.core.config import settings
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

# Configurar Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)


class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    async def extract_text_from_pdf(self, pdf_path: str) -> dict:
        """Extrai texto de PDF com informação de páginas"""
        text_by_page = {}

        try:
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text()
                    if text:
                        text_by_page[page_num] = text

            logger.info(f"Extracted text from {len(text_by_page)} pages")
            return text_by_page

        except Exception as e:
            logger.error(f"Error extracting PDF text: {e}")
            raise

    def chunk_text(self, text_by_page: dict) -> List[dict]:
        """Divide texto em chunks mantendo referência de página"""
        chunks = []

        for page_num, text in text_by_page.items():
            page_chunks = self.text_splitter.split_text(text)

            for idx, chunk_text in enumerate(page_chunks):
                chunks.append({
                    "text": chunk_text,
                    "page_number": page_num,
                    "chunk_index": len(chunks)
                })

        logger.info(f"Created {len(chunks)} chunks")
        return chunks

    async def generate_embedding(self, text: str) -> List[float]:
        """Gera embedding usando Gemini"""
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']

        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise

    async def process_document(
        self,
        db: AsyncSession,
        document: Document,
        pdf_path: str
    ):
        """Pipeline completo de processamento"""
        try:
            # 1. Extrair texto
            document.status = "extracting"
            await db.commit()

            text_by_page = await self.extract_text_from_pdf(pdf_path)

            # 2. Chunking
            document.status = "chunking"
            await db.commit()

            chunks = self.chunk_text(text_by_page)

            # 3. Gerar embeddings e salvar chunks
            document.status = "embedding"
            await db.commit()

            for chunk_data in chunks:
                embedding = await self.generate_embedding(chunk_data["text"])

                chunk = DocumentChunk(
                    chunk_text=chunk_data["text"],
                    chunk_index=chunk_data["chunk_index"],
                    page_number=chunk_data["page_number"],
                    embedding=embedding,
                    document_id=document.id,
                    tenant_id=document.tenant_id
                )
                db.add(chunk)

            # 4. Finalizar
            document.status = "completed"
            await db.commit()

            logger.info(f"Document {document.id} processed successfully")

        except Exception as e:
            document.status = "failed"
            await db.commit()
            logger.error(f"Error processing document {document.id}: {e}")
            raise
