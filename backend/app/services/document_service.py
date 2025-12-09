import pdfplumber
import pandas as pd
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, DocumentChunk
from app.core.config import settings
import logging
from typing import List, Dict, Union

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

    async def extract_text_from_excel(self, excel_path: str) -> dict:
        """Extrai texto de planilhas Excel (XLSX/XLS) preservando estrutura"""
        text_by_sheet = {}

        try:
            excel_file = pd.ExcelFile(excel_path)

            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(excel_file, sheet_name=sheet_name)

                text_parts = []

                # Add sheet name as header
                text_parts.append(f"Planilha: {sheet_name}\n")
                text_parts.append("=" * 50 + "\n\n")

                # Add column headers
                headers = " | ".join(str(col) for col in df.columns)
                text_parts.append(f"Colunas: {headers}\n\n")

                # Add row data
                for idx, row in df.iterrows():
                    # Filter out NaN values and format row
                    row_text = " | ".join(
                        f"{col}: {val}" for col, val in row.items() if pd.notna(val)
                    )
                    if row_text:  # Only add non-empty rows
                        text_parts.append(f"Linha {idx + 1}: {row_text}\n")

                text_by_sheet[sheet_name] = "\n".join(text_parts)

            logger.info(f"Extracted text from {len(text_by_sheet)} sheets")
            return text_by_sheet

        except Exception as e:
            logger.error(f"Error extracting Excel text: {e}")
            raise

    def chunk_text(self, text_by_section: dict, section_type: str = "page") -> List[dict]:
        """
        Divide texto em chunks mantendo referência de seção.

        Args:
            text_by_section: Dicionário com texto por seção (páginas ou planilhas)
            section_type: Tipo de seção - 'page' para PDFs, 'sheet' para Excel

        Returns:
            Lista de dicionários com chunks e metadados
        """
        chunks = []

        for section_id, text in text_by_section.items():
            section_chunks = self.text_splitter.split_text(text)

            for idx, chunk_text in enumerate(section_chunks):
                chunk_data = {
                    "text": chunk_text,
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
