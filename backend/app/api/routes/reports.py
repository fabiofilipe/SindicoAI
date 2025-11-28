from typing import Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import Reservation, CommonArea, User, Unit
from app.schemas.report import (
    CommonAreasUsageReport,
    CommonAreaUsageStats,
    ReservationsReport,
    ReservationReportItem
)

router = APIRouter()

@router.get("/common-areas-usage", response_model=CommonAreasUsageReport)
async def get_common_areas_usage_report(
    start_date: Optional[date] = Query(None, description="Start date for report (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for report (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get usage report for common areas (admin only).
    Returns statistics about reservations per area in a given period.
    """
    # Default to last 30 days if no dates provided
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)

    # Convert dates to datetime for comparison
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.max.time())

    # Get all reservations in period
    result = await db.execute(
        select(Reservation)
        .where(
            and_(
                Reservation.tenant_id == current_user.tenant_id,
                Reservation.start_time >= start_datetime,
                Reservation.start_time <= end_datetime,
                Reservation.status != "cancelled"
            )
        )
        .options(
            # Eager load relationships
            selectinload(Reservation.common_area),
            selectinload(Reservation.user)
        )
    )
    reservations = result.scalars().all()

    # Group by common area
    areas_data = {}
    for reservation in reservations:
        area_id = reservation.common_area_id
        if area_id not in areas_data:
            areas_data[area_id] = {
                'area': reservation.common_area,
                'reservations': [],
                'total_hours': 0.0,
                'days': {}
            }

        # Calculate duration in hours
        duration = (reservation.end_time - reservation.start_time).total_seconds() / 3600
        areas_data[area_id]['total_hours'] += duration
        areas_data[area_id]['reservations'].append(reservation)

        # Track day of week
        day_name = reservation.start_time.strftime('%A')
        areas_data[area_id]['days'][day_name] = areas_data[area_id]['days'].get(day_name, 0) + 1

    # Build stats for each area
    areas_stats = []
    for area_id, data in areas_data.items():
        total_res = len(data['reservations'])
        avg_duration = data['total_hours'] / total_res if total_res > 0 else 0

        # Find most popular day
        most_popular_day = None
        if data['days']:
            most_popular_day = max(data['days'], key=data['days'].get)

        areas_stats.append(CommonAreaUsageStats(
            common_area_id=area_id,
            common_area_name=data['area'].name,
            total_reservations=total_res,
            total_hours_reserved=round(data['total_hours'], 2),
            most_popular_day=most_popular_day,
            average_duration_hours=round(avg_duration, 2)
        ))

    # Sort by most used
    areas_stats.sort(key=lambda x: x.total_reservations, reverse=True)

    return CommonAreasUsageReport(
        start_date=start_date,
        end_date=end_date,
        total_reservations=len(reservations),
        total_areas_used=len(areas_data),
        areas_stats=areas_stats
    )
