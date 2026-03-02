from typing import Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Notification
from .base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    model = Notification

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def list_paginated_by_user(
        self,
        user_id: str,
        page: int,
        page_size: int,
        unread: Optional[bool] = None,
    ) -> tuple[list[Notification], int]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread is not None:
            query = query.where(Notification.is_read == (not unread))

        total = await self.db.scalar(
            select(func.count()).select_from(query.subquery())
        )
        result = await self.db.execute(
            query.offset((page - 1) * page_size).limit(page_size)
        )
        return result.scalars().all(), total or 0

    async def bulk_create(self, notifications: list[Notification]) -> list[Notification]:
        self.db.add_all(notifications)
        await self.db.commit()
        for n in notifications:
            await self.db.refresh(n)
        return notifications

    async def get_by_id_and_user(
        self, notification_id: str, user_id: str
    ) -> Notification | None:
        result = await self.db.execute(
            select(Notification).where(
                Notification.id == notification_id,
                Notification.user_id == user_id,
            )
        )
        return result.scalars().first()
