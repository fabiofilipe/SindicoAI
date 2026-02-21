from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from typing import Optional
from app.models.base import Event, EventRSVP

async def check_capacity(
    db: AsyncSession,
    event_id: str,
    tenant_id: str
) -> bool:
    """Retorna True se evento está no limite de capacidade"""
    result = await db.execute(
        select(Event).where(
            Event.id == event_id,
            Event.tenant_id == tenant_id
        )
    )
    event = result.scalar_one_or_none()

    if not event or not event.capacity:
        return False

    result = await db.execute(
        select(func.count(EventRSVP.id)).where(
            and_(
                EventRSVP.event_id == event_id,
                EventRSVP.response == "attending",
                EventRSVP.tenant_id == tenant_id
            )
        )
    )
    count = result.scalar()
    return count >= event.capacity

async def get_user_rsvp(
    db: AsyncSession,
    event_id: str,
    user_id: str,
    tenant_id: str
) -> Optional[EventRSVP]:
    """Busca RSVP do usuário para um evento"""
    result = await db.execute(
        select(EventRSVP).where(
            and_(
                EventRSVP.event_id == event_id,
                EventRSVP.user_id == user_id,
                EventRSVP.tenant_id == tenant_id
            )
        )
    )
    return result.scalar_one_or_none()

async def count_attendees(
    db: AsyncSession,
    event_id: str,
    tenant_id: str,
    status: str = "attending"
) -> int:
    """Conta RSVPs por status"""
    result = await db.execute(
        select(func.count(EventRSVP.id)).where(
            and_(
                EventRSVP.event_id == event_id,
                EventRSVP.response == status,
                EventRSVP.tenant_id == tenant_id
            )
        )
    )
    return result.scalar()


async def get_attendee_counts(
    db: AsyncSession,
    tenant_id: str,
    event_ids: list[str] | None = None
) -> dict[str, int]:
    """Return {event_id: attendee_count} for given events in a single query."""
    query = (
        select(EventRSVP.event_id, func.count(EventRSVP.id).label("cnt"))
        .where(and_(EventRSVP.tenant_id == tenant_id, EventRSVP.response == "attending"))
        .group_by(EventRSVP.event_id)
    )
    if event_ids is not None:
        query = query.where(EventRSVP.event_id.in_(event_ids))
    result = await db.execute(query)
    return {row.event_id: row.cnt for row in result.all()}
