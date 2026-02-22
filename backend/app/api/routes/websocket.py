from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.websocket import manager
from app.core import security
from app.models.base import User
from app.repositories.user import UserRepository
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


async def get_user_from_token(token: str, db: AsyncSession) -> User:
    try:
        payload = security.decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise Exception("Invalid token")
        user = await UserRepository(db).get_by_id_any_tenant(user_id)
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
    try:
        user = await get_user_from_token(token, db)
        await manager.connect(websocket, user.tenant_id, user.id)
        await manager.send_personal_message(
            {
                "type": "connected",
                "message": "Connected to SindicoAI notifications",
                "user_id": user.id,
            },
            websocket,
        )

        while True:
            data = await websocket.receive_json()
            if data.get("type") == "ping":
                await manager.send_personal_message({"type": "pong"}, websocket)
            else:
                logger.debug(f"Received WebSocket message: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket, user.tenant_id)
        logger.info(f"WebSocket disconnected: user={user.id}")

    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.close(code=1008, reason=str(e))
        except Exception:
            pass
