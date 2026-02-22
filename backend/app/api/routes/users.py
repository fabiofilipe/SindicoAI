from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin, require_self_or_admin
from app.models.base import User
from app.schemas.pagination import PagedResponse
from app.schemas.user import UserResponse, PasswordResetRequest, ChangePasswordRequest
from app.services.user_service import (
    list_users_paginated, get_user_by_id,
    set_user_active, admin_reset_password, change_password,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[UserResponse])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await list_users_paginated(db, current_user.tenant_id, page, page_size)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_self_or_admin()),
):
    user = await get_user_by_id(db, user_id, current_user.tenant_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user


@router.put("/{user_id}/activate", response_model=UserResponse)
async def activate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await set_user_active(db, user_id, current_user.tenant_id, True)


@router.put("/{user_id}/deactivate", response_model=UserResponse)
async def deactivate_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Você não pode desativar sua própria conta")
    return await set_user_active(db, user_id, current_user.tenant_id, False)


@router.put("/{user_id}/reset-password", response_model=UserResponse)
async def reset_user_password(
    user_id: str,
    password_reset: PasswordResetRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await admin_reset_password(db, user_id, current_user.tenant_id, password_reset.new_password)


@router.put("/me/change-password", response_model=UserResponse)
async def change_own_password(
    password_change: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await change_password(db, current_user, password_change.current_password, password_change.new_password)
