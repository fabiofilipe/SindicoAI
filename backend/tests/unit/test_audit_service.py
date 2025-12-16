"""
Unit tests for audit log service
"""
import pytest
from app.services.audit import create_audit_log, get_model_changes
from app.models.audit import AuditLog
from unittest.mock import Mock


@pytest.mark.asyncio
async def test_create_audit_log(db_session, test_user, test_tenant):
    """Test creating an audit log entry"""
    log = await create_audit_log(
        db=db_session,
        user_id=test_user["id"],
        action="CREATE",
        entity_type="Reservation",
        entity_id="res-123",
        changes={"status": {"old": None, "new": "pending"}},
        tenant_id=test_tenant["id"],
        user_email=test_user["email"]
    )

    assert log is not None
    assert log.user_id == test_user["id"]
    assert log.action == "CREATE"
    assert log.entity_type == "Reservation"
    assert log.entity_id == "res-123"
    assert log.tenant_id == test_tenant["id"]
    assert log.user_email == test_user["email"]


@pytest.mark.asyncio
async def test_create_audit_log_handles_errors_gracefully(db_session):
    """Test that audit log creation doesn't break main flow on error"""
    # Invalid data that would cause error
    log = await create_audit_log(
        db=db_session,
        user_id=None,
        action="CREATE",
        entity_type="Test",
        tenant_id=None  # This would cause error
    )

    # Should return None and not raise exception
    assert log is None


def test_get_model_changes():
    """Test detecting changes between old and new data"""
    # Mock object
    old_obj = Mock()
    old_obj.name = "Old Name"
    old_obj.status = "pending"
    old_obj.count = 5

    new_data = {
        "name": "New Name",
        "status": "pending",  # No change
        "count": 10
    }

    changes = get_model_changes(old_obj, new_data)

    assert changes is not None
    assert "name" in changes
    assert changes["name"]["old"] == "Old Name"
    assert changes["name"]["new"] == "New Name"

    assert "count" in changes
    assert changes["count"]["old"] == 5
    assert changes["count"]["new"] == 10

    # Status didn't change
    assert "status" not in changes


def test_get_model_changes_no_changes():
    """Test when there are no changes"""
    old_obj = Mock()
    old_obj.name = "Same Name"

    new_data = {
        "name": "Same Name"
    }

    changes = get_model_changes(old_obj, new_data)

    # Should return None when no changes
    assert changes is None
