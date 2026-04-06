from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.exceptions import NotFoundError, ConflictError, AuthorizationError, UnprocessableError
from app.models.base import Reservation, Notification, User, UserRole
from app.repositories.reservation import ReservationRepository
from app.repositories.user import UserRepository
from app.schemas.pagination import PagedResponse
import logging

logger = logging.getLogger(__name__)

MAX_UNIT_RESERVATIONS = settings.MAX_UNIT_RESERVATIONS


async def check_reservation_conflict(
    db: AsyncSession,
    common_area_id: str,
    start_time: datetime,
    end_time: datetime,
    tenant_id: str,
    exclude_id: str | None = None,
) -> bool:
    """Public alias used in tests."""
    return await ReservationRepository(db).has_conflict(
        common_area_id, start_time, end_time, tenant_id, exclude_id
    )


async def check_unit_limit(
    db: AsyncSession,
    unit_id: str,
    start_time: datetime,
    end_time: datetime,
    tenant_id: str,
    max_reservations: int = MAX_UNIT_RESERVATIONS,
) -> bool:
    """Public alias used in tests."""
    return await ReservationRepository(db).unit_limit_exceeded(
        unit_id, start_time, end_time, tenant_id, max_reservations
    )


async def list_reservations(
    db: AsyncSession, tenant_id: str, page: int, page_size: int, current_user: User
) -> PagedResponse:
    repo = ReservationRepository(db)
    items, total = await repo.list_paginated(
        tenant_id,
        page,
        page_size,
        user_id=current_user.id if current_user.role == UserRole.RESIDENT else None,
    )
    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


async def get_reservation(
    db: AsyncSession, reservation_id: str, tenant_id: str, current_user: User
) -> Reservation:
    reservation = await ReservationRepository(db).get_by_id(reservation_id, tenant_id)
    if not reservation:
        raise NotFoundError("Reserva não encontrada")
    if current_user.role == UserRole.RESIDENT and reservation.user_id != current_user.id:
        raise AuthorizationError("Você só pode visualizar suas próprias reservas")
    return reservation


async def create_reservation(
    db: AsyncSession,
    data: dict,
    current_user: User,
) -> Reservation:
    if current_user.role == UserRole.STAFF:
        raise AuthorizationError("Funcionários não podem criar reservas")

    repo = ReservationRepository(db)

    if await repo.has_conflict(
        common_area_id=data["common_area_id"],
        start_time=data["start_time"],
        end_time=data["end_time"],
        tenant_id=current_user.tenant_id,
    ):
        raise ConflictError("Horário já reservado")

    if current_user.unit_id and await repo.unit_limit_exceeded(
        unit_id=current_user.unit_id,
        start_time=data["start_time"],
        end_time=data["end_time"],
        tenant_id=current_user.tenant_id,
        max_reservations=MAX_UNIT_RESERVATIONS,
    ):
        raise UnprocessableError("Unidade atingiu o limite máximo de reservas simultâneas")

    reservation = Reservation(
        **data,
        user_id=current_user.id,
        unit_id=current_user.unit_id,
        tenant_id=current_user.tenant_id,
    )
    return await repo.save(reservation)


async def cancel_reservation(
    db: AsyncSession, reservation_id: str, current_user: User
) -> None:
    repo = ReservationRepository(db)
    reservation = await repo.get_by_id(reservation_id, current_user.tenant_id)
    if not reservation:
        raise NotFoundError("Reserva não encontrada")
    if current_user.role != UserRole.ADMIN and reservation.user_id != current_user.id:
        raise AuthorizationError("Você só pode cancelar suas próprias reservas")
    await repo.update_fields(reservation, {"status": "cancelled"})


async def update_reservation_status(
    db: AsyncSession,
    reservation_id: str,
    tenant_id: str,
    new_status: str,
    allowed_current_status: str,
) -> Reservation:
    repo = ReservationRepository(db)
    reservation = await repo.get_by_id(reservation_id, tenant_id)
    if not reservation:
        raise NotFoundError("Reserva não encontrada")
    if reservation.status != allowed_current_status:
        raise UnprocessableError(
            f"Não é possível alterar status de reserva com status: {reservation.status}"
        )
    return await repo.update_fields(reservation, {"status": new_status})


async def report_reservation_issue(
    db: AsyncSession,
    reservation_id: str,
    current_user: User,
    description: str,
    severity: str,
) -> dict:
    repo = ReservationRepository(db)
    reservation = await repo.get_by_id(reservation_id, current_user.tenant_id)
    if not reservation:
        raise NotFoundError("Reserva não encontrada")

    user_repo = UserRepository(db)
    admins = await user_repo.get_admins_by_tenant(current_user.tenant_id)

    for admin in admins:
        notification = Notification(
            user_id=admin.id,
            title=f"Problema Reportado - Reserva #{reservation_id[:8]}",
            message=f"Funcionário {current_user.full_name} reportou: {description} (Severidade: {severity})",
            tenant_id=current_user.tenant_id,
        )
        db.add(notification)

    await db.commit()
    return {"message": "Problema reportado com sucesso", "notifications_created": len(admins)}
