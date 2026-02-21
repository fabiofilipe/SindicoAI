from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
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
    try:
        user = await authenticate_user(db, form_data.username, form_data.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return create_tokens(user.id)


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    try:
        return await refresh_user_token(db, request.refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    token = await request_password_reset(db, request.email)
    response = {"message": "If the email exists, a reset link has been sent"}
    if token:
        response["token"] = token  # REMOVE THIS IN PRODUCTION
    return response


@router.post("/reset-password")
async def reset_password_endpoint(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    try:
        await reset_password(db, request.token, request.new_password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"message": "Password has been reset successfully"}
