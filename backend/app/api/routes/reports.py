from typing import Optional
from datetime import date, datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from sqlalchemy.orm import selectinload
import csv
import io

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


def generate_common_areas_csv(report: CommonAreasUsageReport) -> str:
    """Generate CSV content for common areas usage report"""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        'Área Comum',
        'Total de Reservas',
        'Horas Reservadas',
        'Dia Mais Popular',
        'Duração Média (horas)'
    ])

    # Data rows
    for area_stat in report.areas_stats:
        writer.writerow([
            area_stat.common_area_name,
            area_stat.total_reservations,
            area_stat.total_hours_reserved,
            area_stat.most_popular_day or 'N/A',
            area_stat.average_duration_hours or 0
        ])

    # Summary row
    writer.writerow([])
    writer.writerow(['RESUMO'])
    writer.writerow(['Período', f'{report.start_date} a {report.end_date}'])
    writer.writerow(['Total de Reservas', report.total_reservations])
    writer.writerow(['Áreas Utilizadas', report.total_areas_used])

    return output.getvalue()


def generate_reservations_csv(report: ReservationsReport) -> str:
    """Generate CSV content for reservations report"""
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        'ID',
        'Área Comum',
        'Usuário',
        'Email',
        'Unidade',
        'Data/Hora Início',
        'Data/Hora Fim',
        'Status',
        'Duração (horas)',
        'Criado em'
    ])

    # Data rows
    for reservation in report.reservations:
        writer.writerow([
            reservation.id,
            reservation.common_area_name,
            reservation.user_name,
            reservation.user_email,
            reservation.unit_number or 'N/A',
            reservation.start_time.strftime('%Y-%m-%d %H:%M'),
            reservation.end_time.strftime('%Y-%m-%d %H:%M'),
            reservation.status,
            reservation.duration_hours,
            reservation.created_at.strftime('%Y-%m-%d %H:%M')
        ])

    # Summary rows
    writer.writerow([])
    writer.writerow(['RESUMO'])
    writer.writerow(['Período', f'{report.start_date} a {report.end_date}'])
    writer.writerow(['Total de Reservas', report.total_reservations])
    writer.writerow(['Confirmadas', report.confirmed_count])
    writer.writerow(['Pendentes', report.pending_count])
    writer.writerow(['Canceladas', report.cancelled_count])
    writer.writerow(['Horas Totais', report.total_hours_reserved])

    return output.getvalue()

@router.get("/common-areas-usage")
async def get_common_areas_usage_report(
    start_date: Optional[date] = Query(None, description="Start date for report (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for report (YYYY-MM-DD)"),
    format: str = Query("json", description="Response format: json or csv"),
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

    report = CommonAreasUsageReport(
        start_date=start_date,
        end_date=end_date,
        total_reservations=len(reservations),
        total_areas_used=len(areas_data),
        areas_stats=areas_stats
    )

    # Return CSV if requested
    if format.lower() == "csv":
        csv_content = generate_common_areas_csv(report)
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=relatorio_areas_comuns_{start_date}_{end_date}.csv"
            }
        )

    return report


@router.get("/reservations")
async def get_reservations_report(
    start_date: Optional[date] = Query(None, description="Start date for report (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for report (YYYY-MM-DD)"),
    status: Optional[str] = Query(None, description="Filter by status: confirmed, pending, cancelled"),
    common_area_id: Optional[str] = Query(None, description="Filter by specific common area"),
    format: str = Query("json", description="Response format: json or csv"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """
    Get detailed reservations report (admin only).
    Returns list of all reservations in a period with full details.
    """
    # Default to last 30 days if no dates provided
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)

    # Convert dates to datetime for comparison
    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.max.time())

    # Build query
    query = select(Reservation).where(
        and_(
            Reservation.tenant_id == current_user.tenant_id,
            Reservation.start_time >= start_datetime,
            Reservation.start_time <= end_datetime
        )
    )

    # Apply filters
    if status:
        query = query.where(Reservation.status == status)
    if common_area_id:
        query = query.where(Reservation.common_area_id == common_area_id)

    # Eager load relationships
    query = query.options(
        selectinload(Reservation.common_area),
        selectinload(Reservation.user),
        selectinload(Reservation.unit)
    )

    # Order by start time descending
    query = query.order_by(Reservation.start_time.desc())

    # Execute query
    result = await db.execute(query)
    reservations = result.scalars().all()

    # Count by status
    confirmed_count = sum(1 for r in reservations if r.status == "confirmed")
    pending_count = sum(1 for r in reservations if r.status == "pending")
    cancelled_count = sum(1 for r in reservations if r.status == "cancelled")

    # Calculate total hours
    total_hours = 0.0
    reservation_items = []

    for reservation in reservations:
        duration = (reservation.end_time - reservation.start_time).total_seconds() / 3600
        total_hours += duration

        # Get unit number if exists
        unit_number = None
        if reservation.unit:
            unit_number = reservation.unit.number

        reservation_items.append(ReservationReportItem(
            id=reservation.id,
            common_area_name=reservation.common_area.name,
            user_name=reservation.user.full_name or reservation.user.email,
            user_email=reservation.user.email,
            unit_number=unit_number,
            start_time=reservation.start_time,
            end_time=reservation.end_time,
            status=reservation.status,
            duration_hours=round(duration, 2),
            created_at=reservation.created_at
        ))

    report = ReservationsReport(
        start_date=start_date,
        end_date=end_date,
        total_reservations=len(reservations),
        confirmed_count=confirmed_count,
        pending_count=pending_count,
        cancelled_count=cancelled_count,
        total_hours_reserved=round(total_hours, 2),
        reservations=reservation_items
    )

    # Return CSV if requested
    if format.lower() == "csv":
        csv_content = generate_reservations_csv(report)
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=relatorio_reservas_{start_date}_{end_date}.csv"
            }
        )

    return report
