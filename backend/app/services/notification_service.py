from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.base import Notification

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundError
from app.models.base import User
from app.repositories.notification import NotificationRepository
from app.repositories.user import UserRepository
from app.schemas.pagination import PagedResponse
from app.services.websocket import manager
import logging

logger = logging.getLogger(__name__)


async def get_target_user_ids(
    db: AsyncSession,
    tenant_id: str,
    send_to_all: bool = False,
    user_ids: list[str] | None = None,
    unit_ids: list[str] | None = None,
) -> set[str]:
    target_ids: set[str] = set()
    user_repo = UserRepository(db)

    if send_to_all:
        residents = await user_repo.get_residents_by_tenant(tenant_id)
        target_ids.update(u.id for u in residents)

    if user_ids:
        target_ids.update(user_ids)

    if unit_ids:
        for unit_id in unit_ids:
            users = await user_repo.get_by_unit(unit_id)
            target_ids.update(
                u.id for u in users if u.tenant_id == tenant_id
            )

    return target_ids


async def create_notifications(
    db: AsyncSession,
    tenant_id: str,
    title: str,
    message: str,
    user_ids: set[str],
    broadcast: bool = True,
) -> list:
    repo = NotificationRepository(db)
    items = [
        {"title": title, "message": message, "user_id": uid, "tenant_id": tenant_id}
        for uid in user_ids
    ]
    created = await repo.bulk_create_from_data(items)

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
                    },
                },
                tenant_id,
            )

    logger.info(f"Created {len(created)} notifications for tenant {tenant_id}")
    return created


async def list_notifications(
    db: AsyncSession,
    user_id: str,
    page: int,
    page_size: int,
    unread: Optional[bool] = None,
) -> PagedResponse:
    repo = NotificationRepository(db)
    items, total = await repo.list_paginated_by_user(user_id, page, page_size, unread)
    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


async def mark_as_read(
    db: AsyncSession, notification_id: str, user_id: str
) -> "Notification":
    repo = NotificationRepository(db)
    notification = await repo.get_by_id_and_user(notification_id, user_id)
    if not notification:
        raise NotFoundError("Notificação não encontrada")
    return await repo.update_fields(notification, {"is_read": True})


async def delete_notification(
    db: AsyncSession, notification_id: str, user_id: str
) -> None:
    repo = NotificationRepository(db)
    notification = await repo.get_by_id_and_user(notification_id, user_id)
    if not notification:
        raise NotFoundError("Notificação não encontrada")
    await repo.delete(notification)
