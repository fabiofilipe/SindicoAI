from sqlalchemy import select
from app.models.base import Tenant
from app.repositories.base import BaseRepository


class TenantRepository(BaseRepository[Tenant]):
    model = Tenant

    async def get_by_tenant_id(self, tenant_id: str) -> Tenant | None:
        result = await self.db.execute(select(Tenant).where(Tenant.id == tenant_id))
        return result.scalars().first()
