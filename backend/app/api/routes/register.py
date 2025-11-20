from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import json

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.base import User, Unit, Tenant
from app.schemas.user_register import UserRegisterRequest, UserRegisterResponse

router = APIRouter()

@router.post("/register", response_model=UserRegisterResponse)
async def register_user(
    request: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Self-registration endpoint for residents.
    Validates CPF against authorized CPFs for the unit.
    """
    # Find tenant by name
    result = await db.execute(
        select(Tenant).where(Tenant.name == request.tenant_name)
    )
    tenant = result.scalars().first()
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Condominium not found"
        )
    
    # Find unit by number and tenant
    result = await db.execute(
        select(Unit).where(
            Unit.number == request.unit_number,
            Unit.tenant_id == tenant.id
        )
    )
    unit = result.scalars().first()
    
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found"
        )
    
    # Check if CPF is authorized for this unit
    if unit.authorized_cpfs:
        try:
            authorized_list = json.loads(unit.authorized_cpfs)
        except:
            authorized_list = []
        
        if request.cpf not in authorized_list:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="CPF not authorized for this unit. Please contact the administrator."
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No authorized CPFs configured for this unit. Please contact the administrator."
        )
    
    # Check if email already exists
    result = await db.execute(
        select(User).where(User.email == request.email)
    )
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if CPF already exists
    result = await db.execute(
        select(User).where(User.cpf == request.cpf)
    )
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF already registered"
        )
    
    # Create user
    new_user = User(
        email=request.email,
        cpf=request.cpf,
        full_name=request.full_name,
        hashed_password=get_password_hash(request.password),
        role="resident",
        tenant_id=tenant.id,
        unit_id=unit.id,
        is_active=True
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return UserRegisterResponse(
        message="Registration successful! You can now login.",
        user_id=new_user.id
    )
