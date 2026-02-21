from datetime import date, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from sqlalchemy.orm import selectinload
from app.models.base import Reservation
from app.schemas.report import CommonAreaUsageStats, CommonAreasUsageReport, ReservationReportItem, ReservationsReport
import logging

logger = logging.getLogger(__name__)


def _default_date_range(start_date: date | None, end_date: date | None) -> tuple[date, date]:
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)
    return start_date, end_date


async def get_common_areas_usage(
    db: AsyncSession, tenant_id: str,
    start_date: date | None = None, end_date: date | None = None
) -> CommonAreasUsageReport:
    start_date, end_date = _default_date_range(start_date, end_date)
    start_dt = datetime.combine(start_date, datetime.min.time())
    end_dt = datetime.combine(end_date, datetime.max.time())

    result = await db.execute(
        select(Reservation)
        .where(and_(
            Reservation.tenant_id == tenant_id,
            Reservation.start_time >= start_dt,
            Reservation.start_time <= end_dt,
            Reservation.status != "cancelled"
        ))
        .options(selectinload(Reservation.common_area), selectinload(Reservation.user))
    )
    reservations = result.scalars().all()

    areas_data = {}
    for r in reservations:
        aid = r.common_area_id
        if aid not in areas_data:
            areas_data[aid] = {"area": r.common_area, "reservations": [], "total_hours": 0.0, "days": {}}
        duration = (r.end_time - r.start_time).total_seconds() / 3600
        areas_data[aid]["total_hours"] += duration
        areas_data[aid]["reservations"].append(r)
        day_name = r.start_time.strftime("%A")
        areas_data[aid]["days"][day_name] = areas_data[aid]["days"].get(day_name, 0) + 1

    areas_stats = []
    for aid, data in areas_data.items():
        total = len(data["reservations"])
        avg = data["total_hours"] / total if total else 0
        popular = max(data["days"], key=data["days"].get) if data["days"] else None
        areas_stats.append(CommonAreaUsageStats(
            common_area_id=aid, common_area_name=data["area"].name,
            total_reservations=total, total_hours_reserved=round(data["total_hours"], 2),
            most_popular_day=popular, average_duration_hours=round(avg, 2)
        ))

    areas_stats.sort(key=lambda x: x.total_reservations, reverse=True)
    return CommonAreasUsageReport(
        start_date=start_date, end_date=end_date,
        total_reservations=len(reservations), total_areas_used=len(areas_data),
        areas_stats=areas_stats
    )


async def get_reservations_report(
    db: AsyncSession, tenant_id: str,
    start_date: date | None = None, end_date: date | None = None,
    status_filter: str | None = None, common_area_id: str | None = None
) -> ReservationsReport:
    start_date, end_date = _default_date_range(start_date, end_date)
    start_dt = datetime.combine(start_date, datetime.min.time())
    end_dt = datetime.combine(end_date, datetime.max.time())

    query = select(Reservation).where(and_(
        Reservation.tenant_id == tenant_id,
        Reservation.start_time >= start_dt,
        Reservation.start_time <= end_dt
    ))
    if status_filter:
        query = query.where(Reservation.status == status_filter)
    if common_area_id:
        query = query.where(Reservation.common_area_id == common_area_id)

    query = query.options(
        selectinload(Reservation.common_area),
        selectinload(Reservation.user),
        selectinload(Reservation.unit)
    ).order_by(Reservation.start_time.desc())

    result = await db.execute(query)
    reservations = result.scalars().all()

    confirmed = sum(1 for r in reservations if r.status == "confirmed")
    pending = sum(1 for r in reservations if r.status == "pending")
    cancelled = sum(1 for r in reservations if r.status == "cancelled")
    total_hours = 0.0
    items = []

    for r in reservations:
        duration = (r.end_time - r.start_time).total_seconds() / 3600
        total_hours += duration
        items.append(ReservationReportItem(
            id=r.id,
            common_area_name=r.common_area.name,
            user_name=r.user.full_name or r.user.email,
            user_email=r.user.email,
            unit_number=r.unit.number if r.unit else None,
            start_time=r.start_time, end_time=r.end_time,
            status=r.status, duration_hours=round(duration, 2),
            created_at=r.created_at
        ))

    return ReservationsReport(
        start_date=start_date, end_date=end_date,
        total_reservations=len(reservations),
        confirmed_count=confirmed, pending_count=pending, cancelled_count=cancelled,
        total_hours_reserved=round(total_hours, 2), reservations=items
    )
