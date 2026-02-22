from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.schemas.pagination import PagedResponse
from app.services.notification_service import (
    list_notifications, mark_as_read, delete_notification,
    get_target_user_ids, create_notifications,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[NotificationResponse])
async def list_notifications_endpoint(
    unread: Optional[bool] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_notifications(db, current_user.id, page, page_size, unread)


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await mark_as_read(db, notification_id, current_user.id)


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification_endpoint(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await delete_notification(db, notification_id, current_user.id)


@router.post("/", response_model=List[NotificationResponse], status_code=status.HTTP_201_CREATED)
async def create_notification_endpoint(
    notification: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    target_ids = await get_target_user_ids(
        db, current_user.tenant_id,
        send_to_all=notification.send_to_all,
        user_ids=notification.user_ids,
        unit_ids=notification.unit_ids,
    )
    return await create_notifications(
        db, current_user.tenant_id,
        title=notification.title,
        message=notification.message,
        user_ids=target_ids,
    )
