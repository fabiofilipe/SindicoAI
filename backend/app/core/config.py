from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    PROJECT_NAME: str = "SindicoAI"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: str | None = None

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google Gemini API
    GOOGLE_API_KEY: str | None = None

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Upload Configuration
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024

    ALLOWED_MIME_TYPES: dict = Field(default_factory=lambda: {
        "application/pdf": [".pdf"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel": [".xls"]
    })
    ALLOWED_EXTENSIONS: list = Field(default_factory=lambda: [".pdf", ".xlsx", ".xls"])

    # Document Processing
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200

    # AI / RAG
    AI_CACHE_TTL: int = 3600       # seconds
    AI_RATE_LIMIT: int = 50        # requests per day per user

    # Reservations
    MAX_UNIT_RESERVATIONS: int = 2  # max simultaneous confirmed reservations per unit

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings():
    s = Settings()
    if s.SECRET_KEY == "CHANGE_THIS_IN_PRODUCTION":
        logger.warning("SECRET_KEY is using the legacy placeholder value. Set a secure key in .env.")
        raise ValueError("SECRET_KEY must not be the default placeholder. Set a secure value in .env.")
    return s

settings = get_settings()
