"""
Unit tests for WebSocket connection manager
"""
import pytest
from app.services.websocket import ConnectionManager
from unittest.mock import Mock, AsyncMock


@pytest.mark.asyncio
async def test_connection_manager_connect():
    """Test WebSocket connection"""
    manager = ConnectionManager()
    mock_websocket = Mock()
    mock_websocket.accept = AsyncMock()

    tenant_id = "tenant-123"
    user_id = "user-456"

    await manager.connect(mock_websocket, tenant_id, user_id)

    # Check that websocket was accepted
    mock_websocket.accept.assert_called_once()

    # Check that connection was added
    assert tenant_id in manager.active_connections
    assert mock_websocket in manager.active_connections[tenant_id]


@pytest.mark.asyncio
async def test_connection_manager_disconnect():
    """Test WebSocket disconnection"""
    manager = ConnectionManager()
    mock_websocket = Mock()
    mock_websocket.accept = AsyncMock()

    tenant_id = "tenant-123"
    user_id = "user-456"

    # Connect
    await manager.connect(mock_websocket, tenant_id, user_id)
    assert mock_websocket in manager.active_connections[tenant_id]

    # Disconnect
    manager.disconnect(mock_websocket, tenant_id)
    assert mock_websocket not in manager.active_connections.get(tenant_id, set())


@pytest.mark.asyncio
async def test_connection_manager_broadcast_to_tenant():
    """Test broadcasting message to all connections in a tenant"""
    manager = ConnectionManager()

    # Create multiple mock websockets
    ws1 = Mock()
    ws1.accept = AsyncMock()
    ws1.send_json = AsyncMock()

    ws2 = Mock()
    ws2.accept = AsyncMock()
    ws2.send_json = AsyncMock()

    tenant_id = "tenant-123"

    # Connect both
    await manager.connect(ws1, tenant_id, "user-1")
    await manager.connect(ws2, tenant_id, "user-2")

    # Broadcast message
    message = {"type": "test", "data": "hello"}
    await manager.broadcast_to_tenant(message, tenant_id)

    # Both should receive the message
    ws1.send_json.assert_called_once_with(message)
    ws2.send_json.assert_called_once_with(message)


@pytest.mark.asyncio
async def test_connection_manager_get_connection_count():
    """Test getting connection count for a tenant"""
    manager = ConnectionManager()

    ws1 = Mock()
    ws1.accept = AsyncMock()

    ws2 = Mock()
    ws2.accept = AsyncMock()

    tenant_id = "tenant-123"

    # Initially 0
    assert manager.get_connection_count(tenant_id) == 0

    # Add connections
    await manager.connect(ws1, tenant_id, "user-1")
    assert manager.get_connection_count(tenant_id) == 1

    await manager.connect(ws2, tenant_id, "user-2")
    assert manager.get_connection_count(tenant_id) == 2

    # Disconnect one
    manager.disconnect(ws1, tenant_id)
    assert manager.get_connection_count(tenant_id) == 1
