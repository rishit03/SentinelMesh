"""
Tests for the main FastAPI application.
"""

from unittest.mock import AsyncMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def mock_auth():
    """Mock authentication for testing."""
    with patch("main.get_current_org") as mock:
        mock.return_value = "test-org"
        yield mock


class TestHealthEndpoint:
    """Tests for the health check endpoint."""

    def test_health_check(self, client):
        """Test that health check endpoint returns 200."""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy", "service": "sentinelmesh-api"}


class TestLogEndpoint:
    """Tests for the log ingestion endpoint."""

    def test_log_endpoint_requires_auth(self, client):
        """Test that log endpoint requires authentication."""
        response = client.post(
            "/log",
            json={
                "sender": "test-agent",
                "receiver": "test-receiver",
                "context": "test-context",
                "payload": "test payload",
            },
        )
        # Should return 401 or 403 without proper auth
        assert response.status_code in [401, 403]

    @patch("main.insert_log")
    def test_log_endpoint_with_auth(self, mock_insert_log, client, mock_auth):
        """Test log endpoint with proper authentication."""
        mock_insert_log.return_value = AsyncMock()

        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "test-context",
            "payload": "test payload",
        }

        # Mock the authorization header
        headers = {"Authorization": "Bearer test-token"}
        response = client.post("/log", json=log_data, headers=headers)

        # Should succeed with proper auth
        assert response.status_code == 200
        assert "message" in response.json()

    def test_log_endpoint_invalid_data(self, client, mock_auth):
        """Test log endpoint with invalid data."""
        headers = {"Authorization": "Bearer test-token"}

        # Missing required fields
        response = client.post("/log", json={}, headers=headers)
        assert response.status_code == 422  # Validation error


class TestLogsEndpoint:
    """Tests for the logs retrieval endpoint."""

    @patch("main.get_logs")
    def test_logs_endpoint(self, mock_get_logs, client, mock_auth):
        """Test logs retrieval endpoint."""
        mock_get_logs.return_value = []

        headers = {"Authorization": "Bearer test-token"}
        response = client.get("/logs", headers=headers)

        assert response.status_code == 200
        assert "logs" in response.json()

    def test_logs_endpoint_requires_auth(self, client):
        """Test that logs endpoint requires authentication."""
        response = client.get("/logs")
        assert response.status_code in [401, 403]


class TestAlertsEndpoint:
    """Tests for the alerts endpoint."""

    @patch("main.get_logs")
    def test_alerts_endpoint(self, mock_get_logs, client, mock_auth):
        """Test alerts endpoint."""
        mock_get_logs.return_value = []

        headers = {"Authorization": "Bearer test-token"}
        response = client.get("/alerts", headers=headers)

        assert response.status_code == 200
        assert "alerts" in response.json()

    def test_alerts_endpoint_with_min_risk(self, client, mock_auth):
        """Test alerts endpoint with min_risk parameter."""
        headers = {"Authorization": "Bearer test-token"}
        response = client.get("/alerts?min_risk=50", headers=headers)

        assert response.status_code == 200


class TestStatsEndpoint:
    """Tests for the stats endpoint."""

    @patch("main.get_agent_stats")
    def test_stats_endpoint(self, mock_get_agent_stats, client, mock_auth):
        """Test stats endpoint."""
        mock_get_agent_stats.return_value = {}

        headers = {"Authorization": "Bearer test-token"}
        response = client.get("/stats", headers=headers)

        assert response.status_code == 200
        assert "stats" in response.json()
        assert "org" in response.json()

    def test_stats_endpoint_requires_auth(self, client):
        """Test that stats endpoint requires authentication."""
        response = client.get("/stats")
        assert response.status_code in [401, 403]
