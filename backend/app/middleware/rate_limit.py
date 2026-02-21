from fastapi import HTTPException, Request
import redis.asyncio as aioredis
from app.core.config import settings
import logging
import time

logger = logging.getLogger(__name__)

redis_client: aioredis.Redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)


async def check_rate_limit(request: Request, user_id: str, limit: int = 50):
    today = time.strftime('%Y%m%d')
    key = f"rate_limit:ai:{user_id}:{today}"

    try:
        current = await redis_client.get(key)

        if current and int(current) >= limit:
            raise HTTPException(
                status_code=429,
                detail=f"Daily limit of {limit} AI requests exceeded. Try again tomorrow."
            )

        await redis_client.incr(key)

        if not current:
            await redis_client.expire(key, 86400)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Rate limit check failed: {e}")


async def get_user_request_count(user_id: str) -> dict:
    today = time.strftime('%Y%m%d')
    key = f"rate_limit:ai:{user_id}:{today}"

    try:
        current = await redis_client.get(key)
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
