from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import User, UserRole
from .base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, db: AsyncSession):
        super().__init__(db)

    async def get_by_id_any_tenant(self, user_id: str) -> User | None:
        """Used for token validation where tenant context is not yet available."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def get_by_cpf(self, cpf: str) -> User | None:
        result = await self.db.execute(select(User).where(User.cpf == cpf))
        return result.scalars().first()

    async def get_by_reset_token(self, token: str) -> User | None:
        result = await self.db.execute(select(User).where(User.reset_token == token))
        return result.scalars().first()

    async def get_admins_by_tenant(self, tenant_id: str) -> list[User]:
        result = await self.db.execute(
            select(User).where(
                User.tenant_id == tenant_id,
                User.role == UserRole.ADMIN,
            )
        )
        return result.scalars().all()

    async def get_residents_by_tenant(self, tenant_id: str) -> list[User]:
        result = await self.db.execute(
            select(User).where(
                User.tenant_id == tenant_id,
                User.role == UserRole.RESIDENT,
            )
        )
        return result.scalars().all()

    async def get_by_unit(self, unit_id: str) -> list[User]:
        result = await self.db.execute(
            select(User).where(User.unit_id == unit_id)
        )
        return result.scalars().all()

    async def email_exists(self, email: str, tenant_id: str) -> bool:
        result = await self.db.execute(
            select(User.email).where(
                User.email == email,
                User.tenant_id == tenant_id,
            )
        )
        return result.first() is not None

    async def cpf_exists(self, cpf: str, tenant_id: str) -> bool:
        result = await self.db.execute(
            select(User.cpf).where(
                User.cpf == cpf,
                User.tenant_id == tenant_id,
                User.cpf.isnot(None),
            )
        )
        return result.first() is not None
