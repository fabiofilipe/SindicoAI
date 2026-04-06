from datetime import datetime, timedelta, timezone
from typing import Any, Union
from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def create_access_token(
    subject: Union[str, Any],
    session_version: int = 0,
    expires_delta: timedelta = None,
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"exp": expire, "sub": str(subject), "type": "access", "sv": session_version}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(
    subject: Union[str, Any],
    session_version: int = 0,
    refresh_jti: str | None = None,
    expires_delta: timedelta = None,
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    refresh_jti = refresh_jti or generate_refresh_jti()
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": "refresh",
        "sv": session_version,
        "jti": refresh_jti,
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_refresh_jti() -> str:
    return secrets.token_urlsafe(24)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def decode_token(token: str) -> dict:
    """
    Decode and validate JWT token

    Returns:
        Token payload dictionary

    Raises:
        Exception if token is invalid or expired
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
