"""
Integration tests for audit log functionality
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_audit_logs_admin_only(async_client: AsyncClient, test_user, admin_token):
    """Test that only admins can access audit logs"""
    # Admin should succeed
    response = await async_client.get(
        "/api/v1/admin/audit-logs",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_audit_logs_with_filters(async_client: AsyncClient, admin_token):
    """Test audit logs with filters"""
    # Filter by action
    response = await async_client.get(
        "/api/v1/admin/audit-logs?action=CREATE",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    logs = response.json()
    for log in logs:
        assert log["action"] == "CREATE"

    # Filter by entity type
    response = await async_client.get(
        "/api/v1/admin/audit-logs?entity_type=User",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    logs = response.json()
    for log in logs:
        assert log["entity_type"] == "User"


@pytest.mark.asyncio
async def test_get_audit_logs_pagination(async_client: AsyncClient, admin_token):
    """Test audit logs pagination"""
    response = await async_client.get(
        "/api/v1/admin/audit-logs?limit=5&offset=0",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    logs = response.json()
    assert len(logs) <= 5


@pytest.mark.asyncio
async def test_audit_log_stats(async_client: AsyncClient, admin_token):
    """Test audit log statistics endpoint"""
    response = await async_client.get(
        "/api/v1/admin/audit-logs/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    stats = response.json()
    assert "total" in stats
    assert "by_action" in stats
    assert "by_entity" in stats
    assert isinstance(stats["total"], int)
