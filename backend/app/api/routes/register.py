from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.user_register import UserRegisterRequest, UserRegisterResponse
from app.services.registration_service import register_resident
from app.middleware.rate_limit import check_public_rate_limit

router = APIRouter()


@router.post("/register", response_model=UserRegisterResponse)
async def register_user(
    http_request: Request,
    request: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    await check_public_rate_limit(http_request, "public-register", limit=5, window_seconds=3600)
    new_user = await register_resident(
        db, request.tenant_name, request.unit_number,
        request.email, request.cpf, request.full_name, request.password
    )
    return UserRegisterResponse(
        message="Cadastro realizado com sucesso! Você já pode fazer login.",
        user_id=new_user.id
    )
