from typing import Optional
from datetime import date
from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import csv
import io

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.models.base import User
from app.schemas.report import CommonAreasUsageReport, ReservationsReport
from app.services.report_service import get_common_areas_usage, get_reservations_report

router = APIRouter()


def _generate_common_areas_csv(report: CommonAreasUsageReport) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Área Comum", "Total de Reservas", "Horas Reservadas", "Dia Mais Popular", "Duração Média (horas)"])
    for area in report.areas_stats:
        writer.writerow([area.common_area_name, area.total_reservations, area.total_hours_reserved, area.most_popular_day or "N/A", area.average_duration_hours or 0])
    writer.writerow([])
    writer.writerow(["RESUMO"])
    writer.writerow(["Período", f"{report.start_date} a {report.end_date}"])
    writer.writerow(["Total de Reservas", report.total_reservations])
    writer.writerow(["Áreas Utilizadas", report.total_areas_used])
    return output.getvalue()


def _generate_reservations_csv(report: ReservationsReport) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Área Comum", "Usuário", "Email", "Unidade", "Data/Hora Início", "Data/Hora Fim", "Status", "Duração (horas)", "Criado em"])
    for r in report.reservations:
        writer.writerow([r.id, r.common_area_name, r.user_name, r.user_email, r.unit_number or "N/A", r.start_time.strftime("%Y-%m-%d %H:%M"), r.end_time.strftime("%Y-%m-%d %H:%M"), r.status, r.duration_hours, r.created_at.strftime("%Y-%m-%d %H:%M")])
    writer.writerow([])
    writer.writerow(["RESUMO"])
    writer.writerow(["Período", f"{report.start_date} a {report.end_date}"])
    writer.writerow(["Total de Reservas", report.total_reservations])
    writer.writerow(["Confirmadas", report.confirmed_count])
    writer.writerow(["Pendentes", report.pending_count])
    writer.writerow(["Canceladas", report.cancelled_count])
    writer.writerow(["Horas Totais", report.total_hours_reserved])
    return output.getvalue()


@router.get("/common-areas-usage")
async def get_common_areas_usage_report(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    format: str = Query("json"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    report = await get_common_areas_usage(db, current_user.tenant_id, start_date, end_date)
    if format.lower() == "csv":
        return StreamingResponse(
            iter([_generate_common_areas_csv(report)]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=relatorio_areas_comuns_{report.start_date}_{report.end_date}.csv"},
        )
    return report


@router.get("/reservations")
async def get_reservations_report_endpoint(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    status: Optional[str] = Query(None),
    common_area_id: Optional[str] = Query(None),
    format: str = Query("json"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    report = await get_reservations_report(
        db, current_user.tenant_id, start_date, end_date,
        status_filter=status, common_area_id=common_area_id,
    )
    if format.lower() == "csv":
        return StreamingResponse(
            iter([_generate_reservations_csv(report)]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=relatorio_reservas_{report.start_date}_{report.end_date}.csv"},
        )
    return report
