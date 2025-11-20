from fastapi import HTTPException, Request
from redis import Redis
from app.core.config import settings
import time

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

async def check_rate_limit(request: Request, user_id: str, limit: int = 50):
    """
    Limita requisições por usuário por dia
    
    Args:
        request: Objeto Request do FastAPI
        user_id: ID do usuário
        limit: Número máximo de requisições por dia (padrão: 50)
    
    Raises:
        HTTPException: Se o limite diário for excedido
    """
    
    # Criar chave única por usuário e dia
    today = time.strftime('%Y%m%d')
    key = f"rate_limit:ai:{user_id}:{today}"
    
    try:
        # Obter contagem atual
        current = redis_client.get(key)
        
        if current and int(current) >= limit:
            raise HTTPException(
                status_code=429,
                detail=f"Daily limit of {limit} AI requests exceeded. Try again tomorrow."
            )
        
        # Incrementar contador
        redis_client.incr(key)
        
        # Definir expiração de 24 horas (se for primeira requisição do dia)
        if not current:
            redis_client.expire(key, 86400)  # 24 horas em segundos
        
    except HTTPException:
        raise
    except Exception as e:
        # Se Redis falhar, permitir a requisição mas logar o erro
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Rate limit check failed: {e}")

def get_user_request_count(user_id: str) -> dict:
    """
    Obtém informações sobre o uso do usuário
    
    Args:
        user_id: ID do usuário
    
    Returns:
        dict com current_count, limit e remaining
    """
    today = time.strftime('%Y%m%d')
    key = f"rate_limit:ai:{user_id}:{today}"
    
    try:
        current = redis_client.get(key)
        current_count = int(current) if current else 0
        limit = 50
        
        return {
            "current_count": current_count,
            "limit": limit,
            "remaining": max(0, limit - current_count),
            "resets_at": "midnight UTC"
        }
    except Exception as e:
        return {
            "current_count": 0,
            "limit": 50,
            "remaining": 50,
            "error": str(e)
        }
