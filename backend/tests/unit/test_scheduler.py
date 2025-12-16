"""
Unit tests for notification scheduler
"""
import pytest
from datetime import datetime, timedelta
from app.services.scheduler import process_scheduled_notifications
from app.models.base import Notification


@pytest.mark.asyncio
async def test_process_scheduled_notifications_sends_due_notifications(db_session, test_tenant, test_user):
    """Test that scheduled notifications are sent when due"""
    # Create a notification scheduled for the past
    past_time = datetime.utcnow() - timedelta(minutes=5)
    notification = Notification(
        title="Test Scheduled Notification",
        message="This should be sent",
        user_id=test_user["id"],
        tenant_id=test_tenant["id"],
        scheduled_for=past_time,
        sent_at=None
    )
    db_session.add(notification)
    await db_session.commit()

    # Run the scheduler job
    await process_scheduled_notifications()

    # Refresh and check
    await db_session.refresh(notification)
    assert notification.sent_at is not None
    assert notification.sent_at > past_time


@pytest.mark.asyncio
async def test_process_scheduled_notifications_ignores_future_notifications(db_session, test_tenant, test_user):
    """Test that future scheduled notifications are not sent"""
    # Create a notification scheduled for the future
    future_time = datetime.utcnow() + timedelta(hours=1)
    notification = Notification(
        title="Future Notification",
        message="This should NOT be sent yet",
        user_id=test_user["id"],
        tenant_id=test_tenant["id"],
        scheduled_for=future_time,
        sent_at=None
    )
    db_session.add(notification)
    await db_session.commit()

    # Run the scheduler job
    await process_scheduled_notifications()

    # Refresh and check
    await db_session.refresh(notification)
    assert notification.sent_at is None


@pytest.mark.asyncio
async def test_process_scheduled_notifications_ignores_already_sent(db_session, test_tenant, test_user):
    """Test that already sent notifications are not sent again"""
    # Create a notification that was already sent
    past_time = datetime.utcnow() - timedelta(minutes=5)
    sent_time = datetime.utcnow() - timedelta(minutes=3)

    notification = Notification(
        title="Already Sent Notification",
        message="This was already sent",
        user_id=test_user["id"],
        tenant_id=test_tenant["id"],
        scheduled_for=past_time,
        sent_at=sent_time
    )
    db_session.add(notification)
    await db_session.commit()

    original_sent_at = notification.sent_at

    # Run the scheduler job
    await process_scheduled_notifications()

    # Refresh and check that sent_at hasn't changed
    await db_session.refresh(notification)
    assert notification.sent_at == original_sent_at
