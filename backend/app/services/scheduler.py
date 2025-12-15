"""
Background scheduler for periodic tasks
Uses APScheduler for scheduled notifications and other periodic jobs
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db_session
from app.models.base import Notification

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = AsyncIOScheduler()


async def process_scheduled_notifications():
    """
    Process and send notifications that are scheduled for now or past
    Runs every minute
    """
    logger.info("Processing scheduled notifications...")

    async with get_db_session() as db:
        try:
            # Get notifications that:
            # 1. Have a scheduled_for time
            # 2. scheduled_for is in the past or now
            # 3. Haven't been sent yet (sent_at is null)
            now = datetime.utcnow()

            result = await db.execute(
                select(Notification)
                .where(Notification.scheduled_for != None)
                .where(Notification.scheduled_for <= now)
                .where(Notification.sent_at == None)
            )
            pending_notifications = result.scalars().all()

            logger.info(f"Found {len(pending_notifications)} pending scheduled notifications")

            for notification in pending_notifications:
                try:
                    # Mark as sent
                    notification.sent_at = now

                    # TODO: Actually send the notification
                    # This could be:
                    # - Push notification (FCM, APNS)
                    # - Email
                    # - SMS
                    # - WebSocket broadcast
                    # For now, we just mark it as sent

                    logger.info(
                        f"Sent scheduled notification: {notification.id} - {notification.title}"
                    )

                except Exception as e:
                    logger.error(
                        f"Failed to send notification {notification.id}: {str(e)}"
                    )
                    continue

            await db.commit()
            logger.info(f"Successfully processed {len(pending_notifications)} notifications")

        except Exception as e:
            logger.error(f"Error processing scheduled notifications: {str(e)}")
            await db.rollback()


def start_scheduler():
    """
    Start the background scheduler
    Called when the FastAPI app starts
    """
    logger.info("Starting background scheduler...")

    # Add job to process scheduled notifications every minute
    scheduler.add_job(
        process_scheduled_notifications,
        trigger=IntervalTrigger(minutes=1),
        id="process_scheduled_notifications",
        name="Process scheduled notifications",
        replace_existing=True,
    )

    # Start the scheduler
    scheduler.start()
    logger.info("Background scheduler started successfully")


def shutdown_scheduler():
    """
    Shutdown the background scheduler
    Called when the FastAPI app stops
    """
    logger.info("Shutting down background scheduler...")
    scheduler.shutdown()
    logger.info("Background scheduler stopped")
