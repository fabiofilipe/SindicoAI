from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core import security
from app.core.database import get_db, set_tenant_context
from app.models.base import User, UserRole
from app.repositories.user import UserRepository
from app.schemas.token import TokenPayload

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2),
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = await UserRepository(db).get_by_id_any_tenant(token_data.sub)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    await set_tenant_context(db, user.tenant_id)
    return user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can perform this action")
    return current_user


async def require_staff(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in (UserRole.STAFF, UserRole.ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only staff can perform this action")
    return current_user


def require_roles(*roles: UserRole):
    """Factory dependency — allows any of the specified roles."""
    async def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            allowed = ", ".join(r.value for r in roles)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires one of: {allowed}",
            )
        return current_user
    return _check


def require_self_or_admin(user_id_param: str = "user_id"):
    """Factory dependency — allows the user themselves or an admin."""
    async def _check(
        request: Request,
        current_user: User = Depends(get_current_user),
    ) -> User:
        target_id = request.path_params.get(user_id_param)
        if current_user.role != UserRole.ADMIN and str(current_user.id) != str(target_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied",
            )
        return current_user
    return _check

