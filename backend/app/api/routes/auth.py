from typing import Any
from fastapi import APIRouter, Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.config import settings
from app.core.cookies import _set_refresh_cookie, _clear_refresh_cookie
from app.dependencies.auth import get_current_user
from app.models.base import User
from app.schemas.token import Token, TokenRefreshRequest
from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import (
    authenticate_user, create_tokens, refresh_user_token,
    request_password_reset, reset_password, logout_user
)
from app.middleware.rate_limit import check_public_rate_limit

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    await check_public_rate_limit(request, "auth-login", limit=10, window_seconds=300)
    user = await authenticate_user(db, form_data.username, form_data.password)
    tokens = create_tokens(user)
    await db.commit()
    _set_refresh_cookie(response, tokens["refresh_token"])
    tokens["refresh_token"] = None
    return tokens


@router.post("/refresh", response_model=Token)
async def refresh_token(
    response: Response,
    request: TokenRefreshRequest,
    http_request: Request,
    db: AsyncSession = Depends(get_db)
) -> Any:
    refresh_token_value = request.refresh_token or http_request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token_value:
        from app.exceptions import AuthenticationError
        raise AuthenticationError("Refresh token ausente")
    tokens = await refresh_user_token(db, refresh_token_value)
    _set_refresh_cookie(response, tokens["refresh_token"])
    tokens["refresh_token"] = None
    return tokens


@router.post("/logout", status_code=204)
async def logout(
    response: Response,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await logout_user(db, current_user)
    _clear_refresh_cookie(response)
    return response


@router.post("/forgot-password")
async def forgot_password(
    http_request: Request,
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    await check_public_rate_limit(http_request, "auth-forgot-password", limit=5, window_seconds=900)
    await request_password_reset(db, request.email)
    return {"message": "Se o email existir, um link de redefinição foi enviado"}


@router.post("/reset-password")
async def reset_password_endpoint(
    http_request: Request,
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    await check_public_rate_limit(http_request, "auth-reset-password", limit=5, window_seconds=900)
    await reset_password(db, request.token, request.new_password)
    return {"message": "Senha redefinida com sucesso"}
