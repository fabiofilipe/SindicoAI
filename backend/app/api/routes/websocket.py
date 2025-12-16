from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.websocket import manager
from app.core import security
from app.models.base import User
from sqlalchemy.future import select
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


async def get_user_from_token(token: str, db: AsyncSession) -> User:
    """
    Get user from JWT token for WebSocket authentication
    """
    try:
        payload = security.decode_token(token)
        user_id = payload.get("sub")

        if not user_id:
            raise Exception("Invalid token")

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()

        if not user:
            raise Exception("User not found")

        return user

    except Exception as e:
        logger.error(f"WebSocket auth failed: {str(e)}")
        raise


@router.websocket("/ws/notifications")
async def websocket_notifications(
    websocket: WebSocket,
    token: str = Query(..., description="JWT access token"),
    db: AsyncSession = Depends(get_db),
):
    """
    WebSocket endpoint for real-time notifications

    Usage:
        ws://localhost:8000/api/v1/ws/notifications?token=YOUR_JWT_TOKEN

    Messages received:
        {"type": "notification", "data": {...}}
        {"type": "ping"} -> responds with {"type": "pong"}
    """
    try:
        # Authenticate user
        user = await get_user_from_token(token, db)

        # Connect to WebSocket
        await manager.connect(websocket, user.tenant_id, user.id)

        # Send welcome message
        await manager.send_personal_message(
            {
                "type": "connected",
                "message": "Connected to SindicoAI notifications",
                "user_id": user.id,
            },
            websocket,
        )

        # Keep connection alive and handle incoming messages
        while True:
            # Wait for messages from client
            data = await websocket.receive_json()

            # Handle ping/pong for keepalive
            if data.get("type") == "ping":
                await manager.send_personal_message({"type": "pong"}, websocket)

            # Echo back any other messages (for debugging)
            else:
                logger.debug(f"Received WebSocket message: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket, user.tenant_id)
        logger.info(f"WebSocket disconnected: user={user.id}")

    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.close(code=1008, reason=str(e))
        except:
            pass
