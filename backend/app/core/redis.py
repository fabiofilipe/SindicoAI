import redis.asyncio as aioredis
from app.core.config import settings

_client: aioredis.Redis | None = None


def get_redis_client() -> aioredis.Redis:
    """Returns the shared Redis client (lazy singleton)."""
    global _client
    if _client is None:
        _client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    return _client
