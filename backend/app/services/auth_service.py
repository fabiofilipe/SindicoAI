from datetime import timedelta, datetime
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import security
from app.core.config import settings
from app.exceptions import AuthenticationError, NotFoundError, ValidationError
from app.models.base import User
from app.repositories.user import UserRepository
from app.schemas.token import TokenPayload
from app.utils.email import send_password_reset_email
from jose import jwt, JWTError
from pydantic import ValidationError as PydanticValidationError
import logging

logger = logging.getLogger(__name__)


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_email(email)
    if not user or not security.verify_password(password, user.hashed_password):
        raise AuthenticationError("Email ou senha incorretos")
    if not user.is_active:
        raise AuthenticationError("Usuário inativo")
    return user


def create_tokens(user_id: str) -> dict:
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    return {
        "access_token": security.create_access_token(user_id, expires_delta=access_token_expires),
        "refresh_token": security.create_refresh_token(user_id, expires_delta=refresh_token_expires),
        "token_type": "bearer",
    }


async def refresh_user_token(db: AsyncSession, refresh_token: str) -> dict:
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, PydanticValidationError):
        raise AuthenticationError("Credenciais inválidas")

    if payload.get("type") != "refresh":
        raise AuthenticationError("Tipo de token inválido")

    repo = UserRepository(db)
    user = await repo.get_by_id_any_tenant(token_data.sub)

    if not user:
        raise NotFoundError("Usuário não encontrado")
    if not user.is_active:
        raise AuthenticationError("Usuário inativo")

    return create_tokens(user.id)


async def request_password_reset(db: AsyncSession, email: str) -> str | None:
    repo = UserRepository(db)
    user = await repo.get_by_email(email)
    if not user:
        return None

    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    await db.commit()

    await send_password_reset_email(user.email, reset_token)
    return reset_token


async def reset_password(db: AsyncSession, token: str, new_password: str) -> None:
    repo = UserRepository(db)
    user = await repo.get_by_reset_token(token)

    if not user:
        raise ValidationError("Token de redefinição inválido ou expirado")
    if not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise ValidationError("Token de redefinição expirado")

    user.hashed_password = security.get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    await db.commit()
