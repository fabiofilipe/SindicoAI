"""
Dummy test to verify pytest setup is working
"""
import pytest


def test_dummy():
    """Simple test to verify pytest is configured correctly"""
    assert True


def test_addition():
    """Test basic Python functionality"""
    assert 1 + 1 == 2


@pytest.mark.asyncio
async def test_async_works():
    """Test that async tests work"""
    assert True
