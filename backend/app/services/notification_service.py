from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.base import Notification, User, UserRole
from app.services.websocket import manager
import logging

logger = logging.getLogger(__name__)


async def get_target_user_ids(
    db: AsyncSession,
    tenant_id: str,
    send_to_all: bool = False,
    user_ids: list[str] | None = None,
    unit_ids: list[str] | None = None
) -> set[str]:
    """Resolve target user IDs from various criteria."""
    target_ids = set()

    if send_to_all:
        result = await db.execute(
            select(User).where(
                User.tenant_id == tenant_id,
                User.role == UserRole.RESIDENT
            )
        )
        target_ids.update(u.id for u in result.scalars().all())

    if user_ids:
        target_ids.update(user_ids)

    if unit_ids:
        result = await db.execute(
            select(User).where(
                User.unit_id.in_(unit_ids),
                User.tenant_id == tenant_id
            )
        )
        target_ids.update(u.id for u in result.scalars().all())

    return target_ids


async def create_notifications(
    db: AsyncSession,
    tenant_id: str,
    title: str,
    message: str,
    user_ids: set[str],
    broadcast: bool = True
) -> list[Notification]:
    """Create notifications for a set of users and optionally broadcast via WebSocket."""
    created = []
    for user_id in user_ids:
        notification = Notification(
            title=title,
            message=message,
            user_id=user_id,
            tenant_id=tenant_id
        )
        db.add(notification)
        created.append(notification)

    await db.commit()

    for notif in created:
        await db.refresh(notif)

    if broadcast:
        for notif in created:
            await manager.broadcast_to_tenant(
                {
                    "type": "notification",
                    "data": {
                        "id": notif.id,
                        "title": notif.title,
                        "message": notif.message,
                        "created_at": notif.created_at.isoformat() if notif.created_at else None,
                    }
                },
                tenant_id
            )

    logger.info(f"Created {len(created)} notifications for tenant {tenant_id}")
    return created
