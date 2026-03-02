"""
WebSocket manager for real-time notifications
"""
from typing import Dict, Set
from fastapi import WebSocket
import logging
import json

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Manages WebSocket connections grouped by tenant
    """

    def __init__(self):
        # Dictionary: tenant_id -> set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str, user_id: str):
        """
        Add websocket to tenant group (websocket is already accepted by the route)
        """
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = set()

        self.active_connections[tenant_id].add(websocket)

        logger.info(f"WebSocket connected: user={user_id}, tenant={tenant_id}")
        logger.info(f"Total connections for tenant {tenant_id}: {len(self.active_connections[tenant_id])}")

    def disconnect(self, websocket: WebSocket, tenant_id: str):
        """
        Remove WebSocket connection from tenant group
        """
        if tenant_id in self.active_connections:
            self.active_connections[tenant_id].discard(websocket)

            # Clean up empty tenant groups
            if len(self.active_connections[tenant_id]) == 0:
                del self.active_connections[tenant_id]

            logger.info(f"WebSocket disconnected from tenant {tenant_id}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """
        Send message to specific WebSocket connection
        """
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Failed to send personal message: {str(e)}")

    async def broadcast_to_tenant(self, message: dict, tenant_id: str):
        """
        Broadcast message to all connections in a tenant

        Args:
            message: Dictionary with notification data
            tenant_id: Tenant ID to broadcast to
        """
        if tenant_id not in self.active_connections:
            logger.warning(f"No active connections for tenant {tenant_id}")
            return

        connections = self.active_connections[tenant_id].copy()  # Copy to avoid modification during iteration
        disconnected = []

        for connection in connections:
            try:
                await connection.send_json(message)
                logger.debug(f"Sent message to connection in tenant {tenant_id}")
            except Exception as e:
                logger.error(f"Failed to send message: {str(e)}")
                disconnected.append(connection)

        # Clean up disconnected connections
        for connection in disconnected:
            self.disconnect(connection, tenant_id)

        logger.info(f"Broadcasted to {len(connections) - len(disconnected)} connections in tenant {tenant_id}")

    async def broadcast_to_user(self, message: dict, tenant_id: str, user_id: str):
        """
        Send message to specific user (all their connections)

        Note: For simplicity, we broadcast to entire tenant.
        In production, you'd want to track user_id -> connections mapping.
        """
        # For now, broadcast to entire tenant
        # TODO: Implement user-specific targeting
        await self.broadcast_to_tenant(message, tenant_id)

    def get_connection_count(self, tenant_id: str) -> int:
        """
        Get number of active connections for a tenant
        """
        return len(self.active_connections.get(tenant_id, set()))


# Global singleton
manager = ConnectionManager()


def get_ws_manager() -> ConnectionManager:
    """FastAPI dependency returning the shared WebSocket manager."""
    return manager
