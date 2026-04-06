from fastapi import HTTPException, Request
from app.core.config import settings
from app.core.redis import get_redis_client
import logging
import time

logger = logging.getLogger(__name__)

_RATE_LIMIT_WINDOW = 86400  # 24 hours in seconds


async def _check_counter(key: str, limit: int, window_seconds: int, message: str) -> None:
    try:
        redis = get_redis_client()
        async with redis.pipeline() as pipe:
            pipe.incr(key)
            pipe.expire(key, window_seconds)
            results = await pipe.execute()
        new_count = results[0]
        if new_count > limit:
            raise HTTPException(status_code=429, detail=message)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Rate limit check failed: {e}")
        raise HTTPException(status_code=503, detail="Serviço temporariamente indisponível")


async def check_rate_limit(request: Request, user_id: str, limit: int | None = None) -> None:
    limit = limit or settings.AI_RATE_LIMIT
    today = time.strftime("%Y%m%d")
    key = f"rate_limit:ai:{user_id}:{today}"
    await _check_counter(
        key,
        limit,
        _RATE_LIMIT_WINDOW,
        f"Daily limit of {limit} AI requests exceeded. Try again tomorrow.",
    )


async def check_public_rate_limit(
    request: Request,
    scope: str,
    limit: int,
    window_seconds: int,
) -> None:
    client_ip = request.client.host if request.client else "unknown"
    bucket = int(time.time() // window_seconds)
    key = f"rate_limit:{scope}:{client_ip}:{bucket}"
    await _check_counter(
        key,
        limit,
        window_seconds,
        "Muitas tentativas. Tente novamente mais tarde.",
    )


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
