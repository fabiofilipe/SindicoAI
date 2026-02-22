from datetime import datetime
from typing import Optional
from sqlalchemy import select, func, desc
from app.models.audit import AuditLog
from app.repositories.base import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    model = AuditLog

    async def list_filtered(
        self,
        tenant_id: str,
        action: Optional[str] = None,
        entity_type: Optional[str] = None,
        user_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> list[AuditLog]:
        query = select(AuditLog).where(AuditLog.tenant_id == tenant_id)
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
        query = query.order_by(desc(AuditLog.created_at)).offset(offset).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_stats(self, tenant_id: str) -> dict:
        action_q = (
            select(AuditLog.action, func.count(AuditLog.id).label("count"))
            .where(AuditLog.tenant_id == tenant_id)
            .group_by(AuditLog.action)
        )
        entity_q = (
            select(AuditLog.entity_type, func.count(AuditLog.id).label("count"))
            .where(AuditLog.tenant_id == tenant_id)
            .group_by(AuditLog.entity_type)
        )
        total_q = select(func.count(AuditLog.id)).where(AuditLog.tenant_id == tenant_id)

        actions = {row[0]: row[1] for row in (await self.db.execute(action_q)).all()}
        entities = {row[0]: row[1] for row in (await self.db.execute(entity_q)).all()}
        total = await self.db.scalar(total_q)

        return {"total": total, "by_action": actions, "by_entity": entities}
