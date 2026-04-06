import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.websocket import ConnectionManager, get_ws_manager
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
        if payload.get("type") != "access":
            raise Exception("Invalid token type")
        if payload.get("sv", 0) != user.session_version:
            raise Exception("Session no longer valid")
        return user
    except Exception as e:
        logger.error(f"WebSocket auth failed: {str(e)}")
        raise


@router.websocket("/ws/notifications")
async def websocket_notifications(
    websocket: WebSocket,
    db: AsyncSession = Depends(get_db),
    ws_manager: ConnectionManager = Depends(get_ws_manager),
):
    user = None
    await websocket.accept()
    try:
        try:
            auth_data = await asyncio.wait_for(websocket.receive_json(), timeout=5.0)
        except asyncio.TimeoutError:
            await websocket.close(code=1008, reason="Authentication timeout")
            return

        if auth_data.get("type") != "auth" or not auth_data.get("token"):
            await websocket.close(code=1008, reason="Authentication required")
            return

        user = await get_user_from_token(auth_data["token"], db)
        await ws_manager.connect(websocket, user.tenant_id, user.id)
        await ws_manager.send_personal_message(
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
                await ws_manager.send_personal_message({"type": "pong"}, websocket)
            else:
                logger.debug(f"Received WebSocket message: {data}")

    except WebSocketDisconnect:
        if user:
            ws_manager.disconnect(websocket, user.tenant_id)
            logger.info(f"WebSocket disconnected: user={user.id}")

    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        try:
            await websocket.close(code=1008, reason="Authentication failed")
        except Exception:
            pass
