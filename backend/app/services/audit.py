"""
Audit logging service
Creates audit log entries for all important actions
"""
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit import AuditLog
from app.models.base import User
import logging

logger = logging.getLogger(__name__)


async def create_audit_log(
    db: AsyncSession,
    user_id: Optional[str],
    action: str,
    entity_type: str,
    entity_id: Optional[str] = None,
    changes: Optional[Dict[str, Any]] = None,
    tenant_id: Optional[str] = None,
    user_email: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> AuditLog:
    """
    Create an audit log entry

    Args:
        db: Database session
        user_id: ID of user performing action (None for system actions)
        action: Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
        entity_type: Type of entity (User, Reservation, etc.)
        entity_id: ID of affected entity
        changes: Dictionary of changes {"field": {"old": "val1", "new": "val2"}}
        tenant_id: Tenant ID
        user_email: User email (stored for reference)
        ip_address: IP address of request
        user_agent: User agent string

    Returns:
        Created AuditLog instance
    """
    try:
        # If user_id provided but no email, try to fetch user
        if user_id and not user_email:
            user = await db.get(User, user_id)
            if user:
                user_email = user.email

        # If user provided but no tenant_id, get from user
        if user_id and not tenant_id:
            user = await db.get(User, user_id)
            if user:
                tenant_id = user.tenant_id

        audit_log = AuditLog(
            user_id=user_id,
            user_email=user_email,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            changes=changes,
            tenant_id=tenant_id,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        db.add(audit_log)
        # Don't commit here - let the caller commit
        # This allows audit logs to be part of the same transaction

        logger.info(
            f"Audit log created: {action} on {entity_type}#{entity_id} by user {user_id}"
        )

        return audit_log

    except Exception as e:
        logger.error(f"Failed to create audit log: {str(e)}")
        # Don't raise - audit logging should never break the main flow
        return None


def get_model_changes(old_obj: Any, new_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """
    Compare old object with new data and return changes

    Args:
        old_obj: SQLAlchemy model instance
        new_data: Dictionary of new values

    Returns:
        Dictionary of changes in format:
        {"field_name": {"old": old_value, "new": new_value}}
    """
    changes = {}

    for field, new_value in new_data.items():
        if hasattr(old_obj, field):
            old_value = getattr(old_obj, field)

            # Convert to string for comparison (handles datetime, etc.)
            old_str = str(old_value) if old_value is not None else None
            new_str = str(new_value) if new_value is not None else None

            if old_str != new_str:
                changes[field] = {
                    "old": old_value,
                    "new": new_value
                }

    return changes if changes else None
