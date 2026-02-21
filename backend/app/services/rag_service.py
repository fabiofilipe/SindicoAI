import asyncio
import google.generativeai as genai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.models.document import DocumentChunk
from app.core.config import settings
import logging
from typing import List

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GOOGLE_API_KEY)


class RAGService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    async def generate_query_embedding(self, query: str) -> List[float]:
        """Gera embedding para a pergunta do usuário"""
        try:
            result = await asyncio.to_thread(
                genai.embed_content,
                model="models/gemini-embedding-001",
                content=query,
                task_type="retrieval_query"
            )
            embedding = result['embedding']
            logger.info(f"Query embedding generated successfully (dims={len(embedding)})")
            return embedding
        except Exception as e:
            logger.error(f"Error generating query embedding: {e}")
            raise

    async def search_similar_chunks(
        self,
        db: AsyncSession,
        query_embedding: List[float],
        tenant_id: str,
        max_results: int = 5
    ) -> List[tuple]:
        """Busca chunks similares usando pgvector"""

        embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        query = text("""
            SELECT
                dc.id,
                dc.chunk_text,
                dc.page_number,
                d.filename,
                1 - (dc.embedding <=> CAST(:query_embedding AS vector)) as similarity
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE dc.tenant_id = :tenant_id
                AND dc.embedding IS NOT NULL
            ORDER BY dc.embedding <=> CAST(:query_embedding AS vector)
            LIMIT :max_results
        """)

        result = await db.execute(query, {
            "query_embedding": embedding_str,
            "tenant_id": tenant_id,
            "max_results": max_results
        })

        rows = result.fetchall()
        if rows:
            logger.info(f"Found {len(rows)} similar chunks (best similarity={float(rows[0].similarity):.4f})")
        else:
            logger.warning(f"No similar chunks found for tenant {tenant_id}")
        return rows

    async def generate_answer(
        self,
        question: str,
        context_chunks: List[tuple]
    ) -> dict:
        """Gera resposta usando Gemini com contexto"""

        # Construir contexto
        context = "\n\n".join([
            f"[Documento: {chunk.filename}, Página: {chunk.page_number}]\n{chunk.chunk_text}"
            for chunk in context_chunks
        ])

        # Prompt engineering
        prompt = f"""Você é o assistente virtual oficial do condomínio, especializado em responder dúvidas sobre regimentos, atas e documentos internos.

CONTEXTO DOS DOCUMENTOS:
{context}

PERGUNTA DO USUÁRIO:
{question}

INSTRUÇÕES PARA A RESPOSTA:
1. Responda EXCLUSIVAMENTE com base no contexto fornecido acima
2. Se a informação não estiver disponível, diga: "Não encontrei essa informação nos documentos do condomínio. Entre em contato com o Sindico para mais informações."
3. NÃO inclua referências, citações ou nomes de arquivos na resposta - as fontes serão exibidas automaticamente em uma seção separada
4. Formate a resposta de forma profissional e organizada:
   - Use parágrafos curtos e claros
   - Para listas, use marcadores (•) ou numeração
   - Destaque informações importantes quando necessário
5. Seja direto, educado e use linguagem acessível
6. Mantenha um tom profissional e prestativo

RESPOSTA:"""

        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)

            # Extrair fontes (removendo duplicatas por filename)
            seen_files = set()
            sources = []
            for chunk in context_chunks:
                if chunk.filename not in seen_files:
                    seen_files.add(chunk.filename)
                    sources.append({
                        "filename": chunk.filename,
                        "page": chunk.page_number,
                        "similarity": float(chunk.similarity)
                    })

            return {
                "answer": response.text,
                "sources": sources
            }

        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            raise

    async def chat(
        self,
        db: AsyncSession,
        question: str,
        tenant_id: str,
        max_chunks: int = 5
    ) -> dict:
        """Pipeline completo de RAG"""
        logger.info(f"RAG chat started for tenant {tenant_id}: '{question[:80]}...'")

        # 1. Gerar embedding da pergunta
        query_embedding = await self.generate_query_embedding(question)

        # 2. Buscar chunks similares
        similar_chunks = await self.search_similar_chunks(
            db, query_embedding, tenant_id, max_chunks
        )

        if not similar_chunks:
            logger.warning("No similar chunks found, returning fallback response")
            return {
                "answer": "Não encontrei documentos relevantes para responder sua pergunta. Por favor, verifique se os documentos do condomínio foram carregados.",
                "sources": []
            }

        # 3. Gerar resposta
        result = await self.generate_answer(question, similar_chunks)
        logger.info(f"RAG chat completed with {len(result.get('sources', []))} sources")

        return result
