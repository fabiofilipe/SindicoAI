"""
Integration tests for password reset functionality
"""
import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_forgot_password(async_client: AsyncClient, test_user):
    """Test forgot password endpoint"""
    response = await async_client.post(
        "/api/v1/auth/forgot-password",
        json={"email": test_user["email"]}
    )

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "token" in data  # Only in development


@pytest.mark.asyncio
async def test_forgot_password_invalid_email(async_client: AsyncClient):
    """Test forgot password with non-existent email"""
    response = await async_client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "nonexistent@example.com"}
    )

    # Should still return 200 for security (don't reveal if email exists)
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_reset_password_success(async_client: AsyncClient, test_user_with_reset_token):
    """Test successful password reset"""
    token = test_user_with_reset_token["reset_token"]

    response = await async_client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": token,
            "new_password": "NewPassword123!"
        }
    )

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Password has been reset successfully"

    # Try to login with new password
    login_response = await async_client.post(
        "/api/v1/auth/login",
        data={
            "username": test_user_with_reset_token["email"],
            "password": "NewPassword123!"
        }
    )
    assert login_response.status_code == 200


@pytest.mark.asyncio
async def test_reset_password_invalid_token(async_client: AsyncClient):
    """Test reset password with invalid token"""
    response = await async_client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": "invalid-token-123",
            "new_password": "NewPassword123!"
        }
    )

    assert response.status_code == 400
    assert "invalid" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_reset_password_expired_token(async_client: AsyncClient, test_user_with_expired_token):
    """Test reset password with expired token"""
    token = test_user_with_expired_token["reset_token"]

    response = await async_client.post(
        "/api/v1/auth/reset-password",
        json={
            "token": token,
            "new_password": "NewPassword123!"
        }
    )

    assert response.status_code == 400
    assert "expired" in response.json()["detail"].lower()
