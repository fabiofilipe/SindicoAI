from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.tenant import TenantRepository
from app.exceptions import NotFoundError


async def get_tenant_settings(db: AsyncSession, tenant_id: str):
    repo = TenantRepository(db)
    tenant = await repo.get_by_tenant_id(tenant_id)
    if not tenant:
        raise NotFoundError("Tenant not found")
    return tenant


async def update_tenant_settings(
    db: AsyncSession,
    tenant_id: str,
    basic_data: dict,
    reservation_settings: dict | None = None,
    notification_settings: dict | None = None,
):
    repo = TenantRepository(db)
    tenant = await repo.get_by_tenant_id(tenant_id)
    if not tenant:
        raise NotFoundError("Tenant not found")

    for field, value in basic_data.items():
        setattr(tenant, field, value)

    if reservation_settings is not None:
        tenant.reservation_settings = reservation_settings
    if notification_settings is not None:
        tenant.notification_settings = notification_settings

    await db.commit()
    await db.refresh(tenant)
    return tenant
