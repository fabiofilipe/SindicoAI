from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.schemas.settings import SettingsResponse, SettingsUpdate
from app.services.settings_service import get_tenant_settings, update_tenant_settings

router = APIRouter()


@router.get("/", response_model=SettingsResponse)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await get_tenant_settings(db, current_user.tenant_id)


@router.put("/", response_model=SettingsResponse)
async def update_settings(
    settings_update: SettingsUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    basic_data = settings_update.model_dump(
        exclude_unset=True, exclude={"reservation_settings", "notification_settings"}
    )
    reservation_settings = (
        settings_update.reservation_settings.model_dump()
        if settings_update.reservation_settings
        else None
    )
    notification_settings = (
        settings_update.notification_settings.model_dump()
        if settings_update.notification_settings
        else None
    )
    return await update_tenant_settings(
        db, current_user.tenant_id, basic_data, reservation_settings, notification_settings
    )
