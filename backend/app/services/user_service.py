from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_password_hash, verify_password
from app.exceptions import NotFoundError, ValidationError
from app.models.base import User
from app.repositories.user import UserRepository
import logging

logger = logging.getLogger(__name__)


async def list_users_paginated(
    db: AsyncSession, tenant_id: str, page: int, page_size: int
) -> tuple[list[User], int]:
    repo = UserRepository(db)
    return await repo.list_paginated(tenant_id, page, page_size)


async def get_user_by_id(db: AsyncSession, user_id: str, tenant_id: str) -> User | None:
    return await UserRepository(db).get_by_id(user_id, tenant_id)


async def set_user_active(db: AsyncSession, user_id: str, tenant_id: str, is_active: bool) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id, tenant_id)
    if not user:
        raise NotFoundError("Usuário não encontrado")
    return await repo.update_fields(user, {"is_active": is_active})


async def admin_reset_password(db: AsyncSession, user_id: str, tenant_id: str, new_password: str) -> User:
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id, tenant_id)
    if not user:
        raise NotFoundError("Usuário não encontrado")
    return await repo.update_fields(user, {"hashed_password": get_password_hash(new_password)})


async def change_password(db: AsyncSession, user: User, current_password: str, new_password: str) -> User:
    if not verify_password(current_password, user.hashed_password):
        raise ValidationError("Senha atual incorreta")
    repo = UserRepository(db)
    return await repo.update_fields(user, {"hashed_password": get_password_hash(new_password)})
