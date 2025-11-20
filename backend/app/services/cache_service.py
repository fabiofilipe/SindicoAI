from redis import Redis
from app.core.config import settings
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)


class CacheService:
    """
    Serviço de cache para respostas do RAG usando Redis
    """
    
    @staticmethod
    def get_cache_key(question: str, tenant_id: str) -> str:
        """
        Gera chave única de cache baseada na pergunta e tenant
        
        Args:
            question: Pergunta do usuário
            tenant_id: ID do tenant
            
        Returns:
            Chave MD5 hash para cache
        """
        # Normalizar pergunta (lowercase e strip)
        normalized_question = question.lower().strip()
        
        # Criar conteúdo para hash
        content = f"{tenant_id}:{normalized_question}"
        
        # Gerar hash MD5
        hash_key = hashlib.md5(content.encode()).hexdigest()
        
        return f"ai_cache:{hash_key}"
    
    @staticmethod
    def get_cached_response(question: str, tenant_id: str) -> dict | None:
        """
        Busca resposta em cache
        
        Args:
            question: Pergunta do usuário
            tenant_id: ID do tenant
            
        Returns:
            dict com resposta e fontes, ou None se não encontrado
        """
        key = CacheService.get_cache_key(question, tenant_id)
        
        try:
            cached = redis_client.get(key)
            
            if cached:
                logger.info(f"Cache hit for question: {question[:50]}...")
                return json.loads(cached)
            
            logger.debug(f"Cache miss for question: {question[:50]}...")
            return None
        
        except Exception as e:
            logger.error(f"Error reading from cache: {e}")
            return None
    
    @staticmethod
    def cache_response(
        question: str, 
        tenant_id: str, 
        response: dict, 
        ttl: int = 3600
    ) -> bool:
        """
        Salva resposta em cache
        
        Args:
            question: Pergunta do usuário
            tenant_id: ID do tenant
            response: dict com answer e sources
            ttl: Tempo de vida em segundos (padrão: 1 hora)
            
        Returns:
            True se salvo com sucesso, False caso contrário
        """
        key = CacheService.get_cache_key(question, tenant_id)
        
        try:
            # Serializar resposta
            cached_data = json.dumps(response, ensure_ascii=False)
            
            # Salvar com TTL
            redis_client.setex(key, ttl, cached_data)
            
            logger.info(f"Cached response for question: {question[:50]}... (TTL: {ttl}s)")
            return True
        
        except Exception as e:
            logger.error(f"Error writing to cache: {e}")
            return False
    
    @staticmethod
    def invalidate_cache(tenant_id: str) -> int:
        """
        Invalida todo o cache de um tenant específico
        Útil quando novos documentos são adicionados
        
        Args:
            tenant_id: ID do tenant
            
        Returns:
            Número de chaves removidas
        """
        try:
            # Buscar todas as chaves de cache
            pattern = "ai_cache:*"
            keys = redis_client.keys(pattern)
            
            # Nota: Esta é uma implementação simplificada
            # Em produção, seria melhor armazenar tenant_id na chave
            # ou manter um índice separado de chaves por tenant
            
            deleted = 0
            for key in keys:
                redis_client.delete(key)
                deleted += 1
            
            logger.info(f"Invalidated {deleted} cache entries")
            return deleted
        
        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
            return 0
    
    @staticmethod
    def get_cache_stats() -> dict:
        """
        Retorna estatísticas do cache
        
        Returns:
            dict com info sobre o cache
        """
        try:
            pattern = "ai_cache:*"
            keys = redis_client.keys(pattern)
            
            return {
                "total_cached_responses": len(keys),
                "cache_pattern": pattern
            }
        
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {
                "total_cached_responses": 0,
                "error": str(e)
            }
