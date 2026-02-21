from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Notification, User, UserRole
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.notification_service import get_target_user_ids, create_notifications

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    unread: bool = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread is not None:
        query = query.where(Notification.is_read == (not unread))
    result = await db.execute(query)
    return result.scalars().all()


@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    )
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id
        )
    )
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    await db.delete(notification)
    await db.commit()
    return None


@router.post("/", response_model=List[NotificationResponse], status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification: NotificationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create notifications"
        )

    target_ids = await get_target_user_ids(
        db, current_user.tenant_id,
        send_to_all=notification.send_to_all,
        user_ids=notification.user_ids,
        unit_ids=notification.unit_ids
    )

    return await create_notifications(
        db, current_user.tenant_id,
        title=notification.title,
        message=notification.message,
        user_ids=target_ids
    )
