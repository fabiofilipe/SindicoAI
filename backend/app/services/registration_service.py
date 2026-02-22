import json
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.security import get_password_hash, create_access_token
from app.exceptions import NotFoundError, ConflictError, AuthorizationError
from app.models.base import User, Tenant, UserRole
from app.repositories.user import UserRepository
from app.repositories.unit import UnitRepository
import logging

logger = logging.getLogger(__name__)


async def register_resident(
    db: AsyncSession,
    tenant_name: str,
    unit_number: str,
    email: str,
    cpf: str,
    full_name: str,
    password: str,
) -> User:
    result = await db.execute(select(Tenant).where(Tenant.name == tenant_name))
    tenant = result.scalars().first()
    if not tenant:
        raise NotFoundError("Condomínio não encontrado")

    unit_repo = UnitRepository(db)
    unit = await unit_repo.get_by_number(unit_number, tenant.id)
    if not unit:
        raise NotFoundError("Unidade não encontrada")

    if not unit.authorized_cpfs:
        raise AuthorizationError("Nenhum CPF autorizado configurado para esta unidade. Contate o administrador.")
    try:
        authorized_list = json.loads(unit.authorized_cpfs)
    except Exception:
        authorized_list = []
    if cpf not in authorized_list:
        raise AuthorizationError("CPF não autorizado para esta unidade. Contate o administrador.")

    user_repo = UserRepository(db)
    if await user_repo.get_by_email(email):
        raise ConflictError("Email já cadastrado")
    if await user_repo.get_by_cpf(cpf):
        raise ConflictError("CPF já cadastrado")

    new_user = User(
        email=email,
        cpf=cpf,
        full_name=full_name,
        hashed_password=get_password_hash(password),
        role=UserRole.RESIDENT.value,
        tenant_id=tenant.id,
        unit_id=unit.id,
        is_active=True,
    )
    return await user_repo.save(new_user)


async def onboard_tenant(
    db: AsyncSession,
    tenant_name: str,
    tenant_address: str,
    admin_email: str,
    admin_cpf: str,
    admin_full_name: str,
    admin_password: str,
) -> dict:
    result = await db.execute(select(Tenant).where(Tenant.name == tenant_name))
    if result.scalars().first():
        raise ConflictError("Nome do condomínio já existe. Escolha um nome diferente.")

    user_repo = UserRepository(db)
    if await user_repo.get_by_email(admin_email):
        raise ConflictError("Email já cadastrado")

    new_tenant = Tenant(name=tenant_name, address=tenant_address)
    db.add(new_tenant)
    await db.flush()

    new_admin = User(
        email=admin_email,
        cpf=admin_cpf,
        full_name=admin_full_name,
        hashed_password=get_password_hash(admin_password),
        role=UserRole.ADMIN.value,
        tenant_id=new_tenant.id,
        is_active=True,
    )
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_tenant)
    await db.refresh(new_admin)

    access_token = create_access_token(
        new_admin.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"tenant": new_tenant, "admin": new_admin, "access_token": access_token}
