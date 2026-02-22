from fastapi import HTTPException, Request
from app.core.config import settings
from app.core.redis import get_redis_client
import logging
import time

logger = logging.getLogger(__name__)

_RATE_LIMIT_WINDOW = 86400  # 24 hours in seconds


async def check_rate_limit(request: Request, user_id: str, limit: int | None = None) -> None:
    limit = limit or settings.AI_RATE_LIMIT
    today = time.strftime("%Y%m%d")
    key = f"rate_limit:ai:{user_id}:{today}"

    try:
        redis = get_redis_client()
        current = await redis.get(key)
        if current and int(current) >= limit:
            raise HTTPException(
                status_code=429,
                detail=f"Daily limit of {limit} AI requests exceeded. Try again tomorrow.",
            )
        await redis.incr(key)
        if not current:
            await redis.expire(key, _RATE_LIMIT_WINDOW)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Rate limit check failed: {e}")


async def get_user_request_count(user_id: str) -> dict:
    limit = settings.AI_RATE_LIMIT
    today = time.strftime("%Y%m%d")
    key = f"rate_limit:ai:{user_id}:{today}"

    try:
        current = await get_redis_client().get(key)
        current_count = int(current) if current else 0
        return {
            "current_count": current_count,
            "limit": limit,
            "remaining": max(0, limit - current_count),
            "resets_at": "midnight UTC",
        }
    except Exception as e:
        return {"current_count": 0, "limit": limit, "remaining": limit, "error": str(e)}
