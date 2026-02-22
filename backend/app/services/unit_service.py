import csv
import io
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundError
from app.models.base import Unit, User
from app.repositories.unit import UnitRepository
from app.repositories.user import UserRepository
from app.schemas.pagination import PagedResponse
import logging

logger = logging.getLogger(__name__)


async def list_units(
    db: AsyncSession, tenant_id: str, page: int, page_size: int
) -> PagedResponse:
    repo = UnitRepository(db)
    items, total = await repo.list_paginated(tenant_id, page, page_size)
    return PagedResponse.build(items=items, total=total, page=page, page_size=page_size)


async def get_unit(db: AsyncSession, unit_id: str, tenant_id: str) -> Unit:
    unit = await UnitRepository(db).get_by_id(unit_id, tenant_id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")
    return unit


async def create_unit(db: AsyncSession, data: dict, tenant_id: str) -> Unit:
    unit = Unit(**data, tenant_id=tenant_id)
    return await UnitRepository(db).save(unit)


async def update_unit(db: AsyncSession, unit_id: str, tenant_id: str, data: dict) -> Unit:
    repo = UnitRepository(db)
    unit = await repo.get_by_id(unit_id, tenant_id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")
    return await repo.update_fields(unit, data)


async def delete_unit(db: AsyncSession, unit_id: str, tenant_id: str) -> None:
    repo = UnitRepository(db)
    unit = await repo.get_by_id(unit_id, tenant_id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")
    await repo.delete(unit)


async def get_unit_with_residents(
    db: AsyncSession, unit_id: str, tenant_id: str
) -> tuple[Unit, list[User]]:
    unit, residents = await UnitRepository(db).get_with_residents(unit_id, tenant_id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")
    return unit, residents


async def assign_user_to_unit(
    db: AsyncSession, unit_id: str, user_id: str, tenant_id: str
) -> dict:
    unit_repo = UnitRepository(db)
    user_repo = UserRepository(db)

    unit = await unit_repo.get_by_id(unit_id, tenant_id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")

    user = await user_repo.get_by_id(user_id, tenant_id)
    if not user:
        raise NotFoundError("Usuário não encontrado")

    await user_repo.update_fields(user, {"unit_id": unit_id})
    return {"message": f"Usuário {user.full_name} atribuído à unidade {unit.number}"}


async def remove_user_from_unit(
    db: AsyncSession, unit_id: str, user_id: str, tenant_id: str
) -> dict:
    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id, tenant_id)
    if not user or user.unit_id != unit_id:
        raise NotFoundError("Usuário não encontrado nesta unidade")
    await user_repo.update_fields(user, {"unit_id": None})
    return {"message": f"Usuário {user.full_name} removido da unidade"}


async def import_units_from_csv(
    db: AsyncSession, content: bytes, tenant_id: str
) -> dict:
    decoded = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))

    repo = UnitRepository(db)
    existing_keys = await repo.get_existing_keys(tenant_id)

    total_rows = created = skipped = 0
    errors: list[str] = []

    for row in reader:
        total_rows += 1
        try:
            key = (row.get("number"), row.get("block", ""))
            if key in existing_keys:
                skipped += 1
                continue
            unit = Unit(
                number=row.get("number"),
                block=row.get("block"),
                floor=int(row["floor"]) if row.get("floor") else None,
                type=row.get("type"),
                tenant_id=tenant_id,
            )
            db.add(unit)
            existing_keys.add(key)
            created += 1
        except Exception as e:
            errors.append(f"Linha {total_rows}: {e}")

    await db.commit()
    return {"total_rows": total_rows, "created": created, "skipped": skipped, "errors": errors}
