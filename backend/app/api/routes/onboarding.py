from fastapi import APIRouter, Depends
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
    result = await onboard_tenant(
        db, request.tenant_name, request.tenant_address,
        request.admin_email, request.admin_cpf, request.admin_full_name, request.admin_password
    )
    return TenantOnboardingResponse(
        message=f"Condomínio '{request.tenant_name}' criado com sucesso! Você está logado como admin.",
        tenant_id=result["tenant"].id,
        admin_user_id=result["admin"].id,
        access_token=result["access_token"],
        token_type="bearer"
    )
