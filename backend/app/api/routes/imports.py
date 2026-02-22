from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import os

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.models.base import User
from app.schemas.import_data import ImportResponse
from app.services import import_service

router = APIRouter()

_ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".txt"}


def _validate_extension(filename: str) -> None:
    ext = os.path.splitext(filename)[1].lower()
    if ext not in _ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported",
        )


@router.post("/units", response_model=ImportResponse)
async def import_units(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    _validate_extension(file.filename)
    content = await file.read()
    ext = os.path.splitext(file.filename)[1].lower()

    df = await import_service.parse_file(content, ext)
    valid_units, validation_errors = import_service.validate_units(df)

    created_count = 0
    if valid_units:
        created_count = await import_service.import_units(db=db, units=valid_units, tenant_id=current_user.tenant_id)

    return ImportResponse(success_count=created_count, error_count=len(validation_errors), errors=validation_errors)


@router.post("/residents", response_model=ImportResponse)
async def import_residents(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    _validate_extension(file.filename)
    content = await file.read()
    ext = os.path.splitext(file.filename)[1].lower()

    df = await import_service.parse_file(content, ext)
    valid_residents, validation_errors = import_service.validate_residents(df)

    created_count = 0
    import_errors: list[str] = []
    if valid_residents:
        created_count, import_errors = await import_service.import_residents(
            db=db, residents=valid_residents, tenant_id=current_user.tenant_id
        )

    all_errors = validation_errors + import_errors
    return ImportResponse(success_count=created_count, error_count=len(all_errors), errors=all_errors)
