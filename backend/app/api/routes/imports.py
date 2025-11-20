from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import os

from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.base import User
from app.schemas.import_data import ImportResponse
from app.services import import_service

router = APIRouter()

@router.post("/units", response_model=ImportResponse)
async def import_units(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Import units from CSV or Excel file
    Admin only
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can import data"
        )
    
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.csv', '.xlsx', '.xls', '.txt']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported"
        )
    
    # Read file content
    content = await file.read()
    
    try:
        # Parse file
        df = await import_service.parse_file(content, file_extension)
        
        # Validate data
        valid_units, validation_errors = import_service.validate_units(df)
        
        # Import valid units
        created_count = 0
        if valid_units:
            created_count = await import_service.import_units(
                db=db,
                units=valid_units,
                tenant_id=current_user.tenant_id
            )
        
        return ImportResponse(
            success_count=created_count,
            error_count=len(validation_errors),
            errors=validation_errors
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/residents", response_model=ImportResponse)
async def import_residents(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Import residents from CSV or Excel file
    Admin only
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can import data"
        )
    
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in ['.csv', '.xlsx', '.xls', '.txt']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV and Excel files are supported"
        )
    
    # Read file content
    content = await file.read()
    
    try:
        # Parse file
        df = await import_service.parse_file(content, file_extension)
        
        # Validate data
        valid_residents, validation_errors = import_service.validate_residents(df)
        
        # Import valid residents
        created_count = 0
        import_errors = []
        if valid_residents:
            created_count, import_errors = await import_service.import_residents(
                db=db,
                residents=valid_residents,
                tenant_id=current_user.tenant_id
            )
        
        all_errors = validation_errors + import_errors
        
        return ImportResponse(
            success_count=created_count,
            error_count=len(all_errors),
            errors=all_errors
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
