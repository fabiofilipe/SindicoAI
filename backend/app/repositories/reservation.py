from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional

from app.models.base import Reservation
from .base import BaseRepository


class ReservationRepository(BaseRepository[Reservation]):
    model = Reservation

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def list_paginated(
        self,
        tenant_id: str,
        page: int,
        page_size: int,
        base_query=None,
    ) -> tuple[list[Reservation], int]:
        """Override to include eager loading of relationships."""
        query = (
            select(Reservation)
            .where(Reservation.tenant_id == tenant_id)
            .options(
                selectinload(Reservation.common_area),
                selectinload(Reservation.user),
                selectinload(Reservation.unit),
            )
        )
        return await super().list_paginated(tenant_id, page, page_size, base_query=query)

    async def has_conflict(
        self,
        common_area_id: str,
        start_time: datetime,
        end_time: datetime,
        tenant_id: str,
        exclude_id: Optional[str] = None,
    ) -> bool:
        query = select(Reservation).where(
            and_(
                Reservation.common_area_id == common_area_id,
                Reservation.tenant_id == tenant_id,
                Reservation.status == "confirmed",
                Reservation.start_time < end_time,
                Reservation.end_time > start_time,
            )
        )
        if exclude_id:
            query = query.where(Reservation.id != exclude_id)
        result = await self.db.execute(query)
        return result.scalars().first() is not None

    async def unit_limit_exceeded(
        self,
        unit_id: str,
        start_time: datetime,
        end_time: datetime,
        tenant_id: str,
        max_reservations: int,
    ) -> bool:
        result = await self.db.execute(
            select(Reservation).where(
                and_(
                    Reservation.unit_id == unit_id,
                    Reservation.tenant_id == tenant_id,
                    Reservation.status == "confirmed",
                    Reservation.start_time < end_time,
                    Reservation.end_time > start_time,
                )
            )
        )
        return len(result.scalars().all()) >= max_reservations
