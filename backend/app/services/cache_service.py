import hashlib
import json
import logging
from app.core.config import settings
from app.core.redis import get_redis_client

logger = logging.getLogger(__name__)


class CacheService:

    @staticmethod
    def get_cache_key(question: str, tenant_id: str) -> str:
        normalized = question.lower().strip()
        hash_key = hashlib.md5(f"{tenant_id}:{normalized}".encode()).hexdigest()
        return f"ai_cache:{tenant_id}:{hash_key}"

    @staticmethod
    async def get_cached_response(question: str, tenant_id: str) -> dict | None:
        key = CacheService.get_cache_key(question, tenant_id)
        try:
            cached = await get_redis_client().get(key)
            if cached:
                logger.info(f"Cache hit for question: {question[:50]}...")
                return json.loads(cached)
            return None
        except Exception as e:
            logger.error(f"Error reading from cache: {e}")
            return None

    @staticmethod
    async def cache_response(
        question: str,
        tenant_id: str,
        response: dict,
        ttl: int | None = None,
    ) -> bool:
        key = CacheService.get_cache_key(question, tenant_id)
        ttl = ttl or settings.AI_CACHE_TTL
        try:
            await get_redis_client().setex(key, ttl, json.dumps(response, ensure_ascii=False))
            logger.info(f"Cached response for question: {question[:50]}... (TTL: {ttl}s)")
            return True
        except Exception as e:
            logger.error(f"Error writing to cache: {e}")
            return False

    @staticmethod
    async def invalidate_cache(tenant_id: str) -> int:
        try:
            deleted = 0
            async for key in get_redis_client().scan_iter(match=f"ai_cache:{tenant_id}:*"):
                await get_redis_client().delete(key)
                deleted += 1
            logger.info(f"Invalidated {deleted} cache entries for tenant {tenant_id}")
            return deleted
        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
            return 0

    @staticmethod
    async def get_cache_stats() -> dict:
        try:
            keys = [key async for key in get_redis_client().scan_iter(match="ai_cache:*")]
            return {"total_cached_responses": len(keys), "cache_pattern": "ai_cache:*"}
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"total_cached_responses": 0, "error": str(e)}
