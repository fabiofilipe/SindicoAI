from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.schemas.document import ChatRequest, ChatResponse
from app.services.rag_service import RAGService
from app.services.cache_service import CacheService
from app.middleware.rate_limit import check_rate_limit, get_user_request_count

router = APIRouter()

_rag_service = RAGService()


def get_rag_service() -> RAGService:
    return _rag_service


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    http_request: Request,
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Endpoint de chat com o assistente virtual.
    Responde perguntas sobre regimentos e documentos do condomínio.
    
    Rate limit: 50 requisições por dia por usuário
    Cache: Respostas cacheadas por 1 hora
    """
    
    # Verificar rate limit
    await check_rate_limit(http_request, current_user.id, limit=settings.AI_RATE_LIMIT)
    
    # Verificar cache
    cached_response = await CacheService.get_cached_response(
        request.question,
        current_user.tenant_id
    )
    
    if cached_response:
        return ChatResponse(
            answer=cached_response["answer"],
            sources=cached_response["sources"]
        )

    # Processar pergunta se não estiver em cache
    try:
        result = await rag_service.chat(
            db=db,
            question=request.question,
            tenant_id=current_user.tenant_id,
            max_chunks=request.max_chunks
        )
        
        await CacheService.cache_response(
            request.question,
            current_user.tenant_id,
            result,
            ttl=settings.AI_CACHE_TTL,
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


@router.get("/usage")
async def get_usage_stats(
    current_user: User = Depends(get_current_user)
):
    """
    Retorna estatísticas de uso do usuário atual
    """
    return await get_user_request_count(current_user.id)


@router.get("/cache/stats")
async def get_cache_stats(
    current_user: User = Depends(get_current_user)
):
    """
    Retorna estatísticas do cache de respostas
    """
    return await CacheService.get_cache_stats()


@router.delete("/cache")
async def invalidate_cache(
    current_user: User = Depends(require_admin)
):
    """
    Invalida todo o cache (Admin only)
    Útil quando novos documentos são adicionados
    """
    deleted = await CacheService.invalidate_cache(current_user.tenant_id)
    return {
        "message": f"Cache invalidated successfully",
        "deleted_entries": deleted
    }
