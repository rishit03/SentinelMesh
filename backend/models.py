"""
Pydantic models for SentinelMesh API.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class LogResponse(BaseModel):
    """Response model for log ingestion."""

    message: str = Field(..., description="Success message")
    log_id: str = Field(..., description="Unique identifier for the log entry")
    risk: int = Field(..., description="Calculated risk score (0-100)")
    # Updated alerts field to match the output of check_all_rules
    alerts: List[Dict[str, Any]] = Field(..., description="List of triggered alerts")

    class Config:
        schema_extra = {
            "example": {
                "message": "Log received and processed",
                "log_id": "123e4567-e89b-12d3-a456-426614174000",
                "risk": 25,
                "alerts": [
                    {
                        "rule_id": "ip_detection",
                        "message": "IP address detected in payload",
                        "risk": 25,
                    }
                ],
            }
        }


class LogResponse(BaseModel):
    """Response model for log ingestion."""

    message: str = Field(..., description="Success message")
    log_id: str = Field(..., description="Unique identifier for the log entry")
    risk: int = Field(..., description="Calculated risk score (0-100)")
    alerts: List[Dict[str, Any]] = Field(..., description="List of triggered alerts")

    class Config:
        schema_extra = {
            "example": {
                "message": "Log received and processed",
                "log_id": "123e4567-e89b-12d3-a456-426614174000",
                "risk": 25,
                "alerts": [
                    {
                        "rule_id": "ip_detection",
                        "message": "IP address detected in payload",
                        "risk": 25,
                    }
                ],
            }
        }


class LogEntry(BaseModel):
    """Model for a log entry."""

    id: str = Field(..., description="Unique log identifier")
    sender: str = Field(..., description="Log sender")
    receiver: str = Field(..., description="Log receiver")
    context: str = Field(..., description="Log context")
    payload: str = Field(..., description="Log payload")
    timestamp: str = Field(..., description="Original timestamp")
    received_at: str = Field(..., description="Server reception timestamp")
    org: str = Field(..., description="Organization identifier")
    risk: int = Field(..., description="Risk score (0-100)")

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "sender": "agent-alpha",
                "receiver": "central-server",
                "context": "heartbeat",
                "payload": "Agent is online and operational",
                "timestamp": "2025-08-02T10:30:00.000Z",
                "received_at": "2025-08-02T10:30:05.123Z",
                "org": "example-org",
                "risk": 0,
            }
        }


class LogsResponse(BaseModel):
    """Response model for logs retrieval."""

    logs: List[LogEntry] = Field(..., description="List of log entries")
    total: int = Field(..., description="Total number of logs")
    page: int = Field(1, description="Current page number")
    per_page: int = Field(50, description="Logs per page")

    class Config:
        schema_extra = {
            "example": {
                "logs": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "sender": "agent-alpha",
                        "receiver": "central-server",
                        "context": "heartbeat",
                        "payload": "Agent is online and operational",
                        "timestamp": "2025-08-02T10:30:00.000Z",
                        "received_at": "2025-08-02T10:30:05.123Z",
                        "org": "example-org",
                        "risk": 0,
                    }
                ],
                "total": 1,
                "page": 1,
                "per_page": 50,
            }
        }


class AlertEntry(BaseModel):
    """Model for an alert entry."""

    id: str = Field(..., description="Unique log identifier that triggered the alert")
    sender: str = Field(..., description="Log sender")
    receiver: str = Field(..., description="Log receiver")
    context: str = Field(..., description="Log context")
    payload: str = Field(..., description="Log payload")
    timestamp: str = Field(..., description="Original timestamp")
    received_at: str = Field(..., description="Server reception timestamp")
    org: str = Field(..., description="Organization identifier")
    risk: int = Field(..., description="Risk score (0-100)")
    rule_matches: List[Dict[str, Any]] = Field(
        ..., description="Rules that were triggered"
    )

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "sender": "firewall-01",
                "receiver": "security-team",
                "context": "security-alert",
                "payload": "Unauthorized access attempt detected",
                "timestamp": "2025-08-02T10:30:00.000Z",
                "received_at": "2025-08-02T10:30:05.123Z",
                "org": "example-org",
                "risk": 80,
                "rule_matches": [
                    {
                        "rule_id": "security_alert_context",
                        "message": "Security alert context detected",
                        "risk": 60,
                    }
                ],
            }
        }


class AlertsResponse(BaseModel):
    """Response model for alerts retrieval."""

    alerts: List[AlertEntry] = Field(..., description="List of alert entries")
    total: int = Field(..., description="Total number of alerts")
    min_risk: int = Field(80, description="Minimum risk threshold for alerts")

    class Config:
        schema_extra = {
            "example": {
                "alerts": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "sender": "firewall-01",
                        "receiver": "security-team",
                        "context": "security-alert",
                        "payload": "Unauthorized access attempt detected",
                        "timestamp": "2025-08-02T10:30:00.000Z",
                        "received_at": "2025-08-02T10:30:05.123Z",
                        "org": "example-org",
                        "risk": 80,
                        "rule_matches": [],
                    }
                ],
                "total": 1,
                "min_risk": 80,
            }
        }


class AgentStats(BaseModel):
    """Model for agent statistics."""

    total_logs: int = Field(..., description="Total number of logs")
    total_alerts: int = Field(..., description="Total number of alerts")
    active_agents: int = Field(..., description="Number of active agents")
    avg_risk_score: float = Field(..., description="Average risk score")
    top_senders: List[Dict[str, Any]] = Field(..., description="Top log senders")
    risk_distribution: Dict[str, int] = Field(
        ..., description="Risk score distribution"
    )

    class Config:
        schema_extra = {
            "example": {
                "total_logs": 1250,
                "total_alerts": 45,
                "active_agents": 12,
                "avg_risk_score": 15.2,
                "top_senders": [
                    {"sender": "agent-alpha", "count": 450},
                    {"sender": "firewall-01", "count": 320},
                ],
                "risk_distribution": {"low": 1100, "medium": 105, "high": 45},
            }
        }


class StatsResponse(BaseModel):
    """Response model for statistics endpoint."""

    stats: AgentStats = Field(..., description="Agent statistics")
    org: str = Field(..., description="Organization identifier")

    class Config:
        schema_extra = {
            "example": {
                "stats": {
                    "total_logs": 1250,
                    "total_alerts": 45,
                    "active_agents": 12,
                    "avg_risk_score": 15.2,
                    "top_senders": [{"sender": "agent-alpha", "count": 450}],
                    "risk_distribution": {"low": 1100, "medium": 105, "high": 45},
                },
                "org": "example-org",
            }
        }


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Service health status")
    service: str = Field(..., description="Service name")
    timestamp: str = Field(..., description="Health check timestamp")
    version: str = Field(..., description="Service version")
    uptime: float = Field(..., description="Service uptime in seconds")

    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "service": "sentinelmesh-api",
                "timestamp": "2025-08-02T10:30:00.000Z",
                "version": "1.0.0",
                "uptime": 3600.5,
            }
        }


class ErrorResponse(BaseModel):
    """Response model for error responses."""

    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(
        None, description="Additional error details"
    )

    class Config:
        schema_extra = {
            "example": {
                "error": "ValidationError",
                "message": "Invalid request data",
                "details": {"field": "sender", "issue": "Field is required"},
            }
        }
