# 🤖 Implementation Guide - Fase 3: Inteligência Artificial e RAG

> **Guia Completo de Implementação do Sistema RAG com Google Gemini**

Este documento detalha passo a passo a implementação completa da Fase 3 do SindicoAI, transformando a plataforma em um sistema inteligente capaz de responder perguntas sobre regimentos condominiais.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Etapa 1: Infraestrutura Vetorial](#etapa-1-infraestrutura-vetorial)
4. [Etapa 2: Pipeline de Ingestão](#etapa-2-pipeline-de-ingestão)
5. [Etapa 3: Sistema RAG](#etapa-3-sistema-rag)
6. [Etapa 4: Framework de Avaliação](#etapa-4-framework-de-avaliação)
7. [Etapa 5: Controle de Custos](#etapa-5-controle-de-custos)
8. [Testes e Validação](#testes-e-validação)
9. [Deploy e Monitoramento](#deploy-e-monitoramento)

---

## 🎯 Visão Geral

### Objetivo
Implementar um assistente virtual inteligente que responde perguntas sobre regimentos condominiais usando RAG (Retrieval-Augmented Generation).

### Stack Técnica
- **LLM**: Google Gemini 2.5 Flash (atualizado!)
- **Embeddings**: Google Gemini text-embedding-004 (768 dimensões)
- **Framework**: LangChain
- **Vector DB**: PostgreSQL + pgvector
- **PDF Processing**: pdfplumber
- **Evaluation**: Ragas

### Arquitetura do Sistema

```
┌──────────────┐
│  Admin       │
│  Upload PDF  │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Pipeline de Ingestão (Async)      │
│  ┌─────────────────────────────┐   │
│  │ 1. Extração de Texto        │   │
│  │ 2. Chunking (1000 chars)    │   │
│  │ 3. Embedding (Gemini)       │   │
│  │ 4. Salvar em pgvector       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│      Banco de Dados (pgvector)      │
│  ┌─────────────────────────────┐   │
│  │ documents                   │   │
│  │ document_chunks + vectors   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
                │
                ▼
┌──────────────┐        ┌─────────────────────────────┐
│  Usuário     │───────▶│   Endpoint /ai/chat         │
│  Pergunta    │        └────────┬────────────────────┘
└──────────────┘                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Busca Semântica       │
                    │  (pgvector similarity) │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  LangChain RetrievalQA │
                    │  + Gemini 1.5 Flash    │
                    └────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────────────┐
                    │  Resposta + Citações   │
                    └────────────────────────┘
```

---

## 🔧 Pré-requisitos

### 1. Configurar Google Gemini API

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma API Key
3. Adicione ao `.env`:

```bash
# backend/.env
GOOGLE_API_KEY=sua_api_key_aqui
```

### 2. Instalar Dependências

```bash
# Adicionar ao backend/requirements.txt
google-generativeai>=0.3.0
langchain>=0.1.0
langchain-google-genai>=0.0.5
langchain-community>=0.0.10
pdfplumber>=0.10.0
pgvector>=0.2.0
ragas>=0.1.0
```

```bash
# Instalar
cd backend
pip install -r requirements.txt
```

### 3. Habilitar pgvector no PostgreSQL

```sql
-- Executar no banco de dados
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## 📦 Etapa 1: Infraestrutura Vetorial

### 1.1 Criar Modelos de Dados

**Arquivo**: `backend/app/models/document.py`

```python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.core.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    file_type = Column(String, default="pdf")
    file_size = Column(Integer)  # bytes
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="processing")  # processing, completed, failed
    
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
    
    # Vector embedding (768 dimensões para Gemini text-embedding-004)
    embedding = Column(Vector(768))
    
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    document = relationship("Document", back_populates="chunks")
    
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

### 1.2 Criar Schemas Pydantic

**Arquivo**: `backend/app/schemas/document.py`

```python
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
```

### 1.3 Criar Migration

```bash
# Criar migration
docker-compose exec backend alembic revision --autogenerate -m "add_documents_and_chunks_tables"

# Aplicar migration
docker-compose exec backend alembic upgrade head
```

---

## 🔄 Etapa 2: Pipeline de Ingestão

### 2.1 Criar Serviço de Processamento

**Arquivo**: `backend/app/services/document_service.py`

```python
import pdfplumber
import google.generativeai as genai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document, DocumentChunk
from app.core.config import settings
import logging

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
```

### 2.2 Criar Endpoint de Upload

**Arquivo**: `backend/app/api/routes/documents.py`

```python
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import os
import shutil

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.models.document import Document
from app.schemas.document import DocumentUploadResponse, DocumentListResponse
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
```

---

## 🤖 Etapa 3: Sistema RAG

### 3.1 Criar Serviço RAG

**Arquivo**: `backend/app/services/rag_service.py`

```python
import google.generativeai as genai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.models.document import DocumentChunk
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GOOGLE_API_KEY)


class RAGService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def generate_query_embedding(self, query: str) -> List[float]:
        """Gera embedding para a pergunta do usuário"""
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=query,
            task_type="retrieval_query"
        )
        return result['embedding']
    
    async def search_similar_chunks(
        self,
        db: AsyncSession,
        query_embedding: List[float],
        tenant_id: str,
        max_results: int = 5
    ) -> List[DocumentChunk]:
        """Busca chunks similares usando pgvector"""
        
        # Query SQL com cosine similarity
        query = text("""
            SELECT 
                dc.id,
                dc.chunk_text,
                dc.page_number,
                d.filename,
                1 - (dc.embedding <=> :query_embedding) as similarity
            FROM document_chunks dc
            JOIN documents d ON dc.document_id = d.id
            WHERE dc.tenant_id = :tenant_id
            ORDER BY dc.embedding <=> :query_embedding
            LIMIT :max_results
        """)
        
        result = await db.execute(
            query,
            {
                "query_embedding": str(query_embedding),
                "tenant_id": tenant_id,
                "max_results": max_results
            }
        )
        
        return result.fetchall()
    
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
        prompt = f"""Você é um assistente virtual de um condomínio. Sua função é responder perguntas sobre o regimento interno e documentos do condomínio.

CONTEXTO DOS DOCUMENTOS:
{context}

PERGUNTA DO USUÁRIO:
{question}

INSTRUÇÕES:
1. Responda APENAS com base no contexto fornecido
2. Se a informação não estiver no contexto, diga "Não encontrei essa informação nos documentos disponíveis"
3. Cite sempre o documento e a página de onde tirou a informação
4. Seja claro, objetivo e educado
5. Use linguagem acessível

RESPOSTA:"""
        
        try:
            response = self.model.generate_content(prompt)
            
            # Extrair fontes
            sources = [
                {
                    "document": chunk.filename,
                    "page": chunk.page_number,
                    "similarity": float(chunk.similarity)
                }
                for chunk in context_chunks
            ]
            
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
        
        # 1. Gerar embedding da pergunta
        query_embedding = await self.generate_query_embedding(question)
        
        # 2. Buscar chunks similares
        similar_chunks = await self.search_similar_chunks(
            db, query_embedding, tenant_id, max_chunks
        )
        
        if not similar_chunks:
            return {
                "answer": "Não encontrei documentos relevantes para responder sua pergunta. Por favor, verifique se os documentos do condomínio foram carregados.",
                "sources": []
            }
        
        # 3. Gerar resposta
        result = await self.generate_answer(question, similar_chunks)
        
        return result
```

### 3.2 Criar Endpoint de Chat

**Arquivo**: `backend/app/api/routes/ai.py`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import User
from app.schemas.document import ChatRequest, ChatResponse
from app.services.rag_service import RAGService

router = APIRouter()
rag_service = RAGService()


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint de chat com o assistente virtual.
    Responde perguntas sobre regimentos e documentos do condomínio.
    """
    
    try:
        result = await rag_service.chat(
            db=db,
            question=request.question,
            tenant_id=current_user.tenant_id,
            max_chunks=request.max_chunks
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing question: {str(e)}"
        )
```

### 3.3 Registrar Rotas

**Arquivo**: `backend/app/api/routes/__init__.py`

```python
# Adicionar imports
from app.api.routes import documents, ai

# Adicionar routers
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
```

---

## 📊 Etapa 4: Framework de Avaliação

### 4.1 Criar Dataset de Teste

**Arquivo**: `backend/tests/rag_evaluation/test_dataset.json`

```json
[
  {
    "question": "Qual o horário de funcionamento da piscina?",
    "expected_answer": "A piscina funciona das 8h às 22h",
    "context_should_contain": ["piscina", "horário", "funcionamento"]
  },
  {
    "question": "Posso ter animais de estimação?",
    "expected_answer": "Sim, são permitidos animais de estimação de pequeno porte",
    "context_should_contain": ["animais", "estimação", "permitido"]
  },
  {
    "question": "Qual a multa por barulho após 22h?",
    "expected_answer": "A multa por perturbação do sossego após 22h é de R$ 200,00",
    "context_should_contain": ["multa", "barulho", "22h"]
  },
  {
    "question": "Como funciona o sistema de reservas?",
    "expected_answer": "As reservas devem ser feitas com 48h de antecedência através do aplicativo",
    "context_should_contain": ["reserva", "antecedência", "aplicativo"]
  },
  {
    "question": "Quantas vagas de garagem tenho direito?",
    "expected_answer": "Cada unidade tem direito a 2 vagas de garagem",
    "context_should_contain": ["vagas", "garagem", "unidade"]
  }
]
```

### 4.2 Script de Avaliação

**Arquivo**: `backend/tests/rag_evaluation/evaluate.py`

```python
import asyncio
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.services.rag_service import RAGService
from app.core.config import settings

async def evaluate_rag():
    """Avalia a qualidade do sistema RAG"""
    
    # Carregar dataset
    with open("test_dataset.json", "r") as f:
        test_cases = json.load(f)
    
    # Setup database
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    rag_service = RAGService()
    results = []
    
    async with async_session() as db:
        for test_case in test_cases:
            print(f"\n{'='*60}")
            print(f"Question: {test_case['question']}")
            
            # Executar RAG
            result = await rag_service.chat(
                db=db,
                question=test_case['question'],
                tenant_id="test_tenant_id",  # Substituir por tenant real
                max_chunks=5
            )
            
            print(f"Answer: {result['answer']}")
            print(f"Sources: {len(result['sources'])} documents")
            
            # Avaliar
            evaluation = {
                "question": test_case['question'],
                "answer": result['answer'],
                "sources_count": len(result['sources']),
                "expected_keywords": test_case['context_should_contain'],
                "keywords_found": sum(
                    1 for keyword in test_case['context_should_contain']
                    if keyword.lower() in result['answer'].lower()
                )
            }
            
            results.append(evaluation)
    
    # Calcular métricas
    total_tests = len(results)
    avg_sources = sum(r['sources_count'] for r in results) / total_tests
    avg_keyword_match = sum(r['keywords_found'] for r in results) / sum(len(r['expected_keywords']) for r in results)
    
    print(f"\n{'='*60}")
    print("EVALUATION RESULTS")
    print(f"{'='*60}")
    print(f"Total tests: {total_tests}")
    print(f"Average sources retrieved: {avg_sources:.2f}")
    print(f"Average keyword match: {avg_keyword_match:.2%}")
    
    return results

if __name__ == "__main__":
    asyncio.run(evaluate_rag())
```

---

## 💰 Etapa 5: Controle de Custos

### 5.1 Rate Limiting

**Arquivo**: `backend/app/middleware/rate_limit.py`

```python
from fastapi import HTTPException, Request
from redis import Redis
from app.core.config import settings
import time

redis_client = Redis.from_url(settings.REDIS_URL)

async def check_rate_limit(request: Request, user_id: str, limit: int = 50):
    """Limita requisições por usuário"""
    
    key = f"rate_limit:ai:{user_id}:{time.strftime('%Y%m%d')}"
    current = redis_client.get(key)
    
    if current and int(current) >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Daily limit of {limit} AI requests exceeded"
        )
    
    redis_client.incr(key)
    redis_client.expire(key, 86400)  # 24 horas
```

### 5.2 Cache de Respostas

**Arquivo**: `backend/app/services/cache_service.py`

```python
from redis import Redis
from app.core.config import settings
import hashlib
import json

redis_client = Redis.from_url(settings.REDIS_URL)

class CacheService:
    @staticmethod
    def get_cache_key(question: str, tenant_id: str) -> str:
        """Gera chave de cache"""
        content = f"{tenant_id}:{question.lower().strip()}"
        return f"ai_cache:{hashlib.md5(content.encode()).hexdigest()}"
    
    @staticmethod
    def get_cached_response(question: str, tenant_id: str) -> dict:
        """Busca resposta em cache"""
        key = CacheService.get_cache_key(question, tenant_id)
        cached = redis_client.get(key)
        
        if cached:
            return json.loads(cached)
        return None
    
    @staticmethod
    def cache_response(question: str, tenant_id: str, response: dict, ttl: int = 3600):
        """Salva resposta em cache (1 hora por padrão)"""
        key = CacheService.get_cache_key(question, tenant_id)
        redis_client.setex(key, ttl, json.dumps(response))
```

### 5.3 Atualizar Endpoint com Cache e Rate Limit

```python
# backend/app/api/routes/ai.py
from app.middleware.rate_limit import check_rate_limit
from app.services.cache_service import CacheService

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Rate limiting
    await check_rate_limit(request, current_user.id, limit=50)
    
    # Verificar cache
    cached = CacheService.get_cached_response(request.question, current_user.tenant_id)
    if cached:
        return ChatResponse(**cached)
    
    # Processar pergunta
    result = await rag_service.chat(
        db=db,
        question=request.question,
        tenant_id=current_user.tenant_id,
        max_chunks=request.max_chunks
    )
    
    # Salvar em cache
    CacheService.cache_response(request.question, current_user.tenant_id, result)
    
    return ChatResponse(**result)
```

---

## ✅ Testes e Validação

### Checklist de Testes

- [ ] **Upload de PDF funciona**
  ```bash
  curl -X POST "http://localhost:8000/api/v1/documents/upload" \
    -H "Authorization: Bearer TOKEN" \
    -F "file=@regimento.pdf"
  ```

- [ ] **Processamento em background completa**
  - Verificar status do documento muda para "completed"
  - Verificar chunks foram criados no banco

- [ ] **Busca semântica retorna resultados relevantes**
  ```sql
  SELECT chunk_text, page_number 
  FROM document_chunks 
  WHERE tenant_id = 'xxx' 
  LIMIT 5;
  ```

- [ ] **Chat retorna respostas coerentes**
  ```bash
  curl -X POST "http://localhost:8000/api/v1/ai/chat" \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"question": "Qual o horário da piscina?"}'
  ```

- [ ] **Rate limiting funciona**
  - Fazer 51 requisições e verificar erro 429

- [ ] **Cache funciona**
  - Fazer mesma pergunta 2x e verificar resposta instantânea

- [ ] **Isolamento multi-tenant**
  - Verificar que usuários de diferentes tenants não veem documentos uns dos outros

---

## 🚀 Deploy e Monitoramento

### Variáveis de Ambiente

```bash
# .env
GOOGLE_API_KEY=your_api_key_here
REDIS_URL=redis://redis:6379/0
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/sindicoai
```

### Métricas a Monitorar

1. **Custos de API**
   - Tokens consumidos por dia
   - Custo estimado mensal

2. **Performance**
   - Latência média de resposta
   - Taxa de cache hit

3. **Qualidade**
   - Feedback dos usuários
   - Taxa de "não encontrei resposta"

---

## 📋 Checklist Final

### Desenvolvimento
- [ ] Modelos criados e migrados
- [ ] Endpoint de upload implementado
- [ ] Pipeline de processamento funcionando
- [ ] Endpoint de chat implementado
- [ ] Rate limiting configurado
- [ ] Cache implementado
- [ ] Testes unitários criados
- [ ] Dataset de avaliação criado

### Qualidade
- [ ] Avaliação RAG executada (>85% precisão)
- [ ] Isolamento multi-tenant validado
- [ ] Performance testada (<3s por resposta)

### Produção
- [ ] Variáveis de ambiente configuradas
- [ ] Monitoramento de custos ativo
- [ ] Logs configurados
- [ ] Documentação atualizada

---

## 🎯 Próximos Passos

Após completar esta fase:

1. **Melhorias Incrementais**
   - Adicionar suporte a mais tipos de documentos
   - Implementar histórico de conversas
   - Adicionar feedback do usuário

2. **Otimizações**
   - Ajustar tamanho de chunks baseado em métricas
   - Testar diferentes modelos de embedding
   - Implementar re-ranking de resultados

3. **Features Avançadas**
   - Chat com contexto de conversas anteriores
   - Sugestões de perguntas frequentes
   - Resumos automáticos de documentos

---

**Boa implementação! 🚀**
