from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings
from app.models.base import Tenant, User
from app.schemas.onboarding import TenantOnboardingRequest, TenantOnboardingResponse

router = APIRouter()

@router.post("/onboarding", response_model=TenantOnboardingResponse)
async def tenant_onboarding(
    request: TenantOnboardingRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Initial onboarding for new condominium.
    Creates tenant (condominium) and first admin user (síndico).
    Public endpoint - no authentication required.
    """
    # Check if tenant name already exists
    result = await db.execute(
        select(Tenant).where(Tenant.name == request.tenant_name)
    )
    existing_tenant = result.scalars().first()
    
    if existing_tenant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Condominium name already exists. Please choose a different name."
        )
    
    # Check if admin email already exists
    result = await db.execute(
        select(User).where(User.email == request.admin_email)
    )
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create tenant (condominium)
    new_tenant = Tenant(
        name=request.tenant_name,
        address=request.tenant_address
    )
    db.add(new_tenant)
    await db.flush()  # Get tenant ID before creating user
    
    # Create admin user (síndico)
    new_admin = User(
        email=request.admin_email,
        cpf=request.admin_cpf,
        full_name=request.admin_full_name,
        hashed_password=get_password_hash(request.admin_password),
        role="admin",
        tenant_id=new_tenant.id,
        is_active=True
    )
    db.add(new_admin)
    
    await db.commit()
    await db.refresh(new_tenant)
    await db.refresh(new_admin)
    
    # Generate access token for immediate login
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        new_admin.id, expires_delta=access_token_expires
    )
    
    return TenantOnboardingResponse(
        message=f"Condominium '{request.tenant_name}' created successfully! You are now logged in as admin.",
        tenant_id=new_tenant.id,
        admin_user_id=new_admin.id,
        access_token=access_token,
        token_type="bearer"
    )
