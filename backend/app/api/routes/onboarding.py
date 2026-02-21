from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.onboarding import TenantOnboardingRequest, TenantOnboardingResponse
from app.services.registration_service import onboard_tenant

router = APIRouter()


@router.post("/onboarding", response_model=TenantOnboardingResponse)
async def tenant_onboarding(
    request: TenantOnboardingRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await onboard_tenant(
            db, request.tenant_name, request.tenant_address,
            request.admin_email, request.admin_cpf, request.admin_full_name, request.admin_password
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return TenantOnboardingResponse(
        message=f"Condominium '{request.tenant_name}' created successfully! You are now logged in as admin.",
        tenant_id=result["tenant"].id,
        admin_user_id=result["admin"].id,
        access_token=result["access_token"],
        token_type="bearer"
    )
