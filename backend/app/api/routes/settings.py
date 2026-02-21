from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import User, Tenant, UserRole
from app.schemas.settings import SettingsResponse, SettingsUpdate

router = APIRouter()

@router.get("/", response_model=SettingsResponse)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current tenant settings (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view settings"
        )

    result = await db.execute(
        select(Tenant).where(Tenant.id == current_user.tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )

    return tenant

@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update tenant settings (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update settings"
        )

    result = await db.execute(
        select(Tenant).where(Tenant.id == current_user.tenant_id)
    )
    tenant = result.scalar_one_or_none()

    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )

    # Update basic condominium data
    update_data = settings_update.model_dump(exclude_unset=True, exclude={"reservation_settings", "notification_settings"})
    for field, value in update_data.items():
        setattr(tenant, field, value)

    # Update reservation settings if provided
    if settings_update.reservation_settings:
        tenant.reservation_settings = settings_update.reservation_settings.model_dump()

    # Update notification settings if provided
    if settings_update.notification_settings:
        tenant.notification_settings = settings_update.notification_settings.model_dump()

    await db.commit()
    await db.refresh(tenant)

    return tenant
