from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.dependencies.auth import require_admin
from app.models.base import User
from app.repositories.audit import AuditRepository

router = APIRouter()


class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str]
    user_email: Optional[str]
    action: str
    entity_type: str
    entity_id: Optional[str]
    changes: Optional[dict]
    ip_address: Optional[str]
    tenant_id: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/audit-logs", response_model=list[AuditLogResponse])
async def get_audit_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    action: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    return await AuditRepository(db).list_filtered(
        tenant_id=current_user.tenant_id,
        action=action,
        entity_type=entity_type,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
        offset=offset,
    )


@router.get("/audit-logs/stats")
async def get_audit_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return await AuditRepository(db).get_stats(current_user.tenant_id)
