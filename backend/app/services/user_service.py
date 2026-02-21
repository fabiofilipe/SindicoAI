from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.security import get_password_hash, verify_password
from app.models.base import User
import logging

logger = logging.getLogger(__name__)


async def list_users_by_tenant(db: AsyncSession, tenant_id: str) -> list[User]:
    result = await db.execute(
        select(User).where(User.tenant_id == tenant_id)
    )
    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: str, tenant_id: str) -> User | None:
    result = await db.execute(
        select(User).where(User.id == user_id, User.tenant_id == tenant_id)
    )
    return result.scalars().first()


async def set_user_active(db: AsyncSession, user_id: str, tenant_id: str, is_active: bool) -> User:
    user = await get_user_by_id(db, user_id, tenant_id)
    if not user:
        raise ValueError("User not found")
    user.is_active = is_active
    await db.commit()
    await db.refresh(user)
    return user


async def admin_reset_password(db: AsyncSession, user_id: str, tenant_id: str, new_password: str) -> User:
    user = await get_user_by_id(db, user_id, tenant_id)
    if not user:
        raise ValueError("User not found")
    user.hashed_password = get_password_hash(new_password)
    await db.commit()
    await db.refresh(user)
    return user


async def change_password(db: AsyncSession, user: User, current_password: str, new_password: str) -> User:
    if not verify_password(current_password, user.hashed_password):
        raise ValueError("Senha atual incorreta")
    user.hashed_password = get_password_hash(new_password)
    await db.commit()
    await db.refresh(user)
    return user
