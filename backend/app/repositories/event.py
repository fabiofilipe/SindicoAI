from datetime import datetime
from typing import Optional
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from app.models.base import Event, EventRSVP
from app.repositories.base import BaseRepository


class EventRepository(BaseRepository[Event]):
    model = Event

    async def list_with_filters(
        self,
        tenant_id: str,
        page: int,
        page_size: int,
        status_filter: Optional[str] = None,
        upcoming: Optional[bool] = None,
    ) -> tuple[list[Event], int]:
        base = (
            select(Event)
            .where(Event.tenant_id == tenant_id)
            .options(selectinload(Event.common_area))
        )
        if status_filter:
            base = base.where(Event.status == status_filter)
        if upcoming is True:
            base = base.where(Event.event_date >= datetime.utcnow())
        elif upcoming is False:
            base = base.where(Event.event_date < datetime.utcnow())
        base = base.order_by(Event.event_date.desc())
        return await self.list_paginated(tenant_id, page, page_size, base_query=base)


class EventRSVPRepository(BaseRepository[EventRSVP]):
    model = EventRSVP

    async def get_user_rsvp(
        self, event_id: str, user_id: str, tenant_id: str
    ) -> Optional[EventRSVP]:
        result = await self.db.execute(
            select(EventRSVP).where(
                and_(
                    EventRSVP.event_id == event_id,
                    EventRSVP.user_id == user_id,
                    EventRSVP.tenant_id == tenant_id,
                )
            )
        )
        return result.scalar_one_or_none()

    async def count_attending(self, event_id: str, tenant_id: str) -> int:
        result = await self.db.execute(
            select(func.count(EventRSVP.id)).where(
                and_(
                    EventRSVP.event_id == event_id,
                    EventRSVP.response == "attending",
                    EventRSVP.tenant_id == tenant_id,
                )
            )
        )
        return result.scalar() or 0

    async def get_attendee_counts(
        self, tenant_id: str, event_ids: list[str]
    ) -> dict[str, int]:
        query = (
            select(EventRSVP.event_id, func.count(EventRSVP.id).label("cnt"))
            .where(and_(EventRSVP.tenant_id == tenant_id, EventRSVP.response == "attending"))
            .group_by(EventRSVP.event_id)
        )
        if event_ids:
            query = query.where(EventRSVP.event_id.in_(event_ids))
        result = await self.db.execute(query)
        return {row.event_id: row.cnt for row in result.all()}

    async def list_by_event(
        self, event_id: str, tenant_id: str, response_filter: Optional[str] = None
    ) -> list[EventRSVP]:
        query = select(EventRSVP).where(
            EventRSVP.event_id == event_id,
            EventRSVP.tenant_id == tenant_id,
        )
        if response_filter:
            query = query.where(EventRSVP.response == response_filter)
        result = await self.db.execute(query)
        return result.scalars().all()
