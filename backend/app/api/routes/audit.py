from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.core.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.base import User
from app.models.audit import AuditLog
from pydantic import BaseModel

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


@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    action: Optional[str] = Query(None, description="Filter by action (CREATE, UPDATE, DELETE)"),
    entity_type: Optional[str] = Query(None, description="Filter by entity type (User, Reservation, etc.)"),
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    start_date: Optional[datetime] = Query(None, description="Filter by start date"),
    end_date: Optional[datetime] = Query(None, description="Filter by end date"),
    limit: int = Query(100, ge=1, le=1000, description="Number of results"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
):
    """
    Get audit logs with filters (Admin only)

    Returns paginated list of audit logs for the current tenant
    """
    query = select(AuditLog).where(AuditLog.tenant_id == current_user.tenant_id)

    # Apply filters
    if action:
        query = query.where(AuditLog.action == action)

    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)

    if user_id:
        query = query.where(AuditLog.user_id == user_id)

    if start_date:
        query = query.where(AuditLog.created_at >= start_date)

    if end_date:
        query = query.where(AuditLog.created_at <= end_date)

    # Order by most recent first
    query = query.order_by(desc(AuditLog.created_at))

    # Pagination
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    audit_logs = result.scalars().all()

    return audit_logs


@router.get("/audit-logs/stats")
async def get_audit_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Get audit log statistics (Admin only)

    Returns counts by action type and entity type
    """
    from sqlalchemy import func

    # Count by action
    action_query = (
        select(AuditLog.action, func.count(AuditLog.id).label('count'))
        .where(AuditLog.tenant_id == current_user.tenant_id)
        .group_by(AuditLog.action)
    )
    action_result = await db.execute(action_query)
    actions = {row[0]: row[1] for row in action_result.all()}

    # Count by entity type
    entity_query = (
        select(AuditLog.entity_type, func.count(AuditLog.id).label('count'))
        .where(AuditLog.tenant_id == current_user.tenant_id)
        .group_by(AuditLog.entity_type)
    )
    entity_result = await db.execute(entity_query)
    entities = {row[0]: row[1] for row in entity_result.all()}

    # Total count
    total_query = select(func.count(AuditLog.id)).where(
        AuditLog.tenant_id == current_user.tenant_id
    )
    total_result = await db.execute(total_query)
    total = total_result.scalar()

    return {
        "total": total,
        "by_action": actions,
        "by_entity": entities
    }
