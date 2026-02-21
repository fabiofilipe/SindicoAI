import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.security import get_password_hash, create_access_token
from app.core.config import settings
from app.models.base import User, Tenant, Unit, UserRole
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


async def register_resident(
    db: AsyncSession,
    tenant_name: str,
    unit_number: str,
    email: str,
    cpf: str,
    full_name: str,
    password: str
) -> User:
    """Register a new resident. Validates tenant, unit, CPF authorization."""
    # Find tenant
    result = await db.execute(select(Tenant).where(Tenant.name == tenant_name))
    tenant = result.scalars().first()
    if not tenant:
        raise ValueError("Condominium not found")

    # Find unit
    result = await db.execute(
        select(Unit).where(Unit.number == unit_number, Unit.tenant_id == tenant.id)
    )
    unit = result.scalars().first()
    if not unit:
        raise ValueError("Unit not found")

    # Check CPF authorization
    if not unit.authorized_cpfs:
        raise PermissionError("No authorized CPFs configured for this unit. Please contact the administrator.")
    try:
        authorized_list = json.loads(unit.authorized_cpfs)
    except Exception:
        authorized_list = []
    if cpf not in authorized_list:
        raise PermissionError("CPF not authorized for this unit. Please contact the administrator.")

    # Check uniqueness
    result = await db.execute(select(User).where(User.email == email))
    if result.scalars().first():
        raise ValueError("Email already registered")

    result = await db.execute(select(User).where(User.cpf == cpf))
    if result.scalars().first():
        raise ValueError("CPF already registered")

    # Create user
    new_user = User(
        email=email,
        cpf=cpf,
        full_name=full_name,
        hashed_password=get_password_hash(password),
        role=UserRole.RESIDENT.value,
        tenant_id=tenant.id,
        unit_id=unit.id,
        is_active=True
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


async def onboard_tenant(
    db: AsyncSession,
    tenant_name: str,
    tenant_address: str,
    admin_email: str,
    admin_cpf: str,
    admin_full_name: str,
    admin_password: str
) -> dict:
    """Create a new tenant and admin user. Returns tenant, admin, and access token."""
    # Check tenant name
    result = await db.execute(select(Tenant).where(Tenant.name == tenant_name))
    if result.scalars().first():
        raise ValueError("Condominium name already exists. Please choose a different name.")

    # Check admin email
    result = await db.execute(select(User).where(User.email == admin_email))
    if result.scalars().first():
        raise ValueError("Email already registered")

    # Create tenant
    new_tenant = Tenant(name=tenant_name, address=tenant_address)
    db.add(new_tenant)
    await db.flush()

    # Create admin
    new_admin = User(
        email=admin_email,
        cpf=admin_cpf,
        full_name=admin_full_name,
        hashed_password=get_password_hash(admin_password),
        role=UserRole.ADMIN.value,
        tenant_id=new_tenant.id,
        is_active=True
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_tenant)
    await db.refresh(new_admin)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(new_admin.id, expires_delta=access_token_expires)

    return {
        "tenant": new_tenant,
        "admin": new_admin,
        "access_token": access_token
    }
