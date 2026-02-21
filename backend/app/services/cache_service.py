import redis.asyncio as aioredis
from app.core.config import settings
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

redis_client: aioredis.Redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)


class CacheService:

    @staticmethod
    def get_cache_key(question: str, tenant_id: str) -> str:
        normalized_question = question.lower().strip()
        content = f"{tenant_id}:{normalized_question}"
        hash_key = hashlib.md5(content.encode()).hexdigest()
        return f"ai_cache:{tenant_id}:{hash_key}"

    @staticmethod
    async def get_cached_response(question: str, tenant_id: str) -> dict | None:
        key = CacheService.get_cache_key(question, tenant_id)
        try:
            cached = await redis_client.get(key)
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
        ttl: int = 3600
    ) -> bool:
        key = CacheService.get_cache_key(question, tenant_id)
        try:
            cached_data = json.dumps(response, ensure_ascii=False)
            await redis_client.setex(key, ttl, cached_data)
            logger.info(f"Cached response for question: {question[:50]}... (TTL: {ttl}s)")
            return True
        except Exception as e:
            logger.error(f"Error writing to cache: {e}")
            return False

    @staticmethod
    async def invalidate_cache(tenant_id: str) -> int:
        try:
            pattern = f"ai_cache:{tenant_id}:*"
            deleted = 0
            async for key in redis_client.scan_iter(match=pattern):
                await redis_client.delete(key)
                deleted += 1
            logger.info(f"Invalidated {deleted} cache entries for tenant {tenant_id}")
            return deleted
        except Exception as e:
            logger.error(f"Error invalidating cache: {e}")
            return 0

    @staticmethod
    async def get_cache_stats() -> dict:
        try:
            keys = []
            async for key in redis_client.scan_iter(match="ai_cache:*"):
                keys.append(key)
            return {
                "total_cached_responses": len(keys),
                "cache_pattern": "ai_cache:*"
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"total_cached_responses": 0, "error": str(e)}
