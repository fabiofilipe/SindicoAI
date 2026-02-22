from typing import Any
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.token import Token, TokenRefreshRequest
from app.schemas.user import ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import (
    authenticate_user, create_tokens, refresh_user_token,
    request_password_reset, reset_password
)

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = await authenticate_user(db, form_data.username, form_data.password)
    return create_tokens(user.id)


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await refresh_user_token(db, request.refresh_token)


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    token = await request_password_reset(db, request.email)
    response: dict = {"message": "Se o email existir, um link de redefinição foi enviado"}
    if token:
        response["token"] = token  # REMOVE IN PRODUCTION
    return response


@router.post("/reset-password")
async def reset_password_endpoint(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    await reset_password(db, request.token, request.new_password)
    return {"message": "Senha redefinida com sucesso"}
