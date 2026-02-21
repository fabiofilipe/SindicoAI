from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.user_register import UserRegisterRequest, UserRegisterResponse
from app.services.registration_service import register_resident

router = APIRouter()


@router.post("/register", response_model=UserRegisterResponse)
async def register_user(
    request: UserRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        new_user = await register_resident(
            db, request.tenant_name, request.unit_number,
            request.email, request.cpf, request.full_name, request.password
        )
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return UserRegisterResponse(message="Registration successful! You can now login.", user_id=new_user.id)
