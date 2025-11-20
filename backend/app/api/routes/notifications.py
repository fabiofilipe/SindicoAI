from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import Notification, User
from app.schemas.notification import NotificationCreate, NotificationResponse

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
async def list_notifications(
    unread: bool = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all notifications for the current user, optionally filter by unread"""
    query = select(Notification).where(Notification.user_id == current_user.id)
    
    if unread is not None:
        query = query.where(Notification.is_read == (not unread))
    
    result = await db.execute(query)
    notifications = result.scalars().all()
    return notifications

@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
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
    """Delete a notification"""
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
    """
    Create notifications (admin only).
    Can send to specific users, all residents of specific units, or all residents.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create notifications"
        )
    
    target_user_ids = set()
    
    # Collect target user IDs based on criteria
    if notification.send_to_all:
        # Send to all residents in tenant
        result = await db.execute(
            select(User).where(
                User.tenant_id == current_user.tenant_id,
                User.role == "resident"
            )
        )
        users = result.scalars().all()
        target_user_ids.update([u.id for u in users])
    
    if notification.user_ids:
        # Add specific user IDs
        target_user_ids.update(notification.user_ids)
    
    if notification.unit_ids:
        # Add all residents of specified units
        result = await db.execute(
            select(User).where(
                User.unit_id.in_(notification.unit_ids),
                User.tenant_id == current_user.tenant_id
            )
        )
        users = result.scalars().all()
        target_user_ids.update([u.id for u in users])
    
    # Create notifications for all target users
    created_notifications = []
    for user_id in target_user_ids:
        db_notification = Notification(
            title=notification.title,
            message=notification.message,
            user_id=user_id,
            tenant_id=current_user.tenant_id
        )
        db.add(db_notification)
        created_notifications.append(db_notification)
    
    await db.commit()
    
    # Refresh all notifications
    for notif in created_notifications:
        await db.refresh(notif)
    
    return created_notifications
