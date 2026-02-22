from fastapi import APIRouter, Depends, Query, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.schemas.pagination import PagedResponse
from app.schemas.unit import UnitCreate, UnitUpdate, UnitResponse, UnitWithResidents, AssignUserRequest, CSVImportResponse
from app.services.unit_service import (
    list_units, get_unit, create_unit, update_unit, delete_unit,
    get_unit_with_residents, assign_user_to_unit, remove_user_from_unit,
    import_units_from_csv,
)

router = APIRouter()


@router.get("/", response_model=PagedResponse[UnitResponse])
async def list_units_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await list_units(db, current_user.tenant_id, page, page_size)


@router.post("/", response_model=UnitResponse, status_code=status.HTTP_201_CREATED)
async def create_unit_endpoint(
    unit: UnitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await create_unit(db, unit.model_dump(), current_user.tenant_id)


@router.get("/{unit_id}", response_model=UnitResponse)
async def get_unit_endpoint(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_unit(db, unit_id, current_user.tenant_id)


@router.put("/{unit_id}", response_model=UnitResponse)
async def update_unit_endpoint(
    unit_id: str,
    unit_update: UnitUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await update_unit(db, unit_id, current_user.tenant_id, unit_update.model_dump(exclude_unset=True))


@router.delete("/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_unit_endpoint(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    await delete_unit(db, unit_id, current_user.tenant_id)


@router.get("/{unit_id}/with-residents", response_model=UnitWithResidents)
async def get_unit_with_residents_endpoint(
    unit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    unit, residents = await get_unit_with_residents(db, unit_id, current_user.tenant_id)
    return {
        "id": unit.id,
        "number": unit.number,
        "block": unit.block,
        "floor": unit.floor,
        "type": unit.type,
        "tenant_id": unit.tenant_id,
        "created_at": unit.created_at,
        "updated_at": unit.updated_at,
        "residents": [
            {"id": r.id, "full_name": r.full_name, "email": r.email, "role": r.role}
            for r in residents
        ],
    }


@router.put("/{unit_id}/assign-user")
async def assign_user_to_unit_endpoint(
    unit_id: str,
    request: AssignUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await assign_user_to_unit(db, unit_id, request.user_id, current_user.tenant_id)


@router.delete("/{unit_id}/remove-user/{user_id}")
async def remove_user_from_unit_endpoint(
    unit_id: str,
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await remove_user_from_unit(db, unit_id, user_id, current_user.tenant_id)


@router.post("/import-csv", response_model=CSVImportResponse)
async def import_units_csv_endpoint(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    content = await file.read()
    return await import_units_from_csv(db, content, current_user.tenant_id)
