from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.cookies import _set_refresh_cookie
from app.schemas.onboarding import TenantOnboardingRequest, TenantOnboardingResponse
from app.services.registration_service import onboard_tenant
from app.middleware.rate_limit import check_public_rate_limit

router = APIRouter()


@router.post("/onboarding", response_model=TenantOnboardingResponse)
async def tenant_onboarding(
    http_request: Request,
    response: Response,
    request: TenantOnboardingRequest,
    db: AsyncSession = Depends(get_db)
):
    await check_public_rate_limit(http_request, "public-onboarding", limit=3, window_seconds=3600)
    result = await onboard_tenant(
        db, request.tenant_name, request.tenant_address,
        request.admin_email, request.admin_cpf, request.admin_full_name, request.admin_password
    )
    _set_refresh_cookie(response, result["refresh_token"])
    return TenantOnboardingResponse(
        message=f"Condomínio '{request.tenant_name}' criado com sucesso! Você está logado como admin.",
        tenant_id=result["tenant"].id,
        admin_user_id=result["admin"].id,
        access_token=result["access_token"],
        token_type="bearer"
    )
