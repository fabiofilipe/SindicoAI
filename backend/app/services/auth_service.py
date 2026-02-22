from datetime import timedelta, datetime
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core import security
from app.core.config import settings
from app.exceptions import AuthenticationError, NotFoundError, ValidationError
from app.models.base import User
from app.schemas.token import TokenPayload
from app.utils.email import send_password_reset_email
from jose import jwt, JWTError
from pydantic import ValidationError as PydanticValidationError
import logging

logger = logging.getLogger(__name__)


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    """Authenticate user by email and password. Returns User or raises ValueError."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user or not security.verify_password(password, user.hashed_password):
        raise AuthenticationError("Email ou senha incorretos")
    if not user.is_active:
        raise AuthenticationError("Usuário inativo")
    return user


def create_tokens(user_id: str) -> dict:
    """Create access and refresh token pair."""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    return {
        "access_token": security.create_access_token(user_id, expires_delta=access_token_expires),
        "refresh_token": security.create_refresh_token(user_id, expires_delta=refresh_token_expires),
        "token_type": "bearer",
    }


async def refresh_user_token(db: AsyncSession, refresh_token: str) -> dict:
    """Validate refresh token and create new token pair. Raises ValueError on failure."""
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, PydanticValidationError):
        raise AuthenticationError("Credenciais inválidas")

    if payload.get("type") != "refresh":
        raise AuthenticationError("Tipo de token inválido")

    result = await db.execute(select(User).where(User.id == token_data.sub))
    user = result.scalars().first()

    if not user:
        raise NotFoundError("Usuário não encontrado")
    if not user.is_active:
        raise AuthenticationError("Usuário inativo")

    return create_tokens(user.id)


async def request_password_reset(db: AsyncSession, email: str) -> str | None:
    """Generate password reset token. Returns token or None if user not found."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()

    if not user:
        return None

    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    await db.commit()

    await send_password_reset_email(user.email, reset_token)
    return reset_token


async def reset_password(db: AsyncSession, token: str, new_password: str) -> None:
    """Reset password using token. Raises ValueError on failure."""
    result = await db.execute(select(User).where(User.reset_token == token))
    user = result.scalars().first()

    if not user:
        raise ValidationError("Token de redefinição inválido ou expirado")

    if not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise ValidationError("Token de redefinição expirado")

    user.hashed_password = security.get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    await db.commit()
