import uuid
import logging
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Request, Query, Depends, HTTPException, WebSocket, WebSocketDisconnect

from models import LogEntry, LogResponse, LogsResponse, AlertsResponse
from sqlite import insert_log, get_logs
from rules.rule_engine import check_all_rules


logger = logging.getLogger(__name__)

logs_router = APIRouter()

# WebSocket management
active_connections: List[WebSocket] = []

@logs_router.websocket("/ws/logs")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Keep the connection alive, wait for messages (or just pass)
            await websocket.receive_text() 
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.exception(f"WebSocket error: {e}")

@logs_router.post("/log", response_model=LogResponse)
async def receive_log(
    request: Request,
    org: str = "example-org" # Removed authentication
) -> LogResponse:
    """
    Receive and process a log entry from an AI agent.

    This endpoint accepts log data, assigns it a unique ID, processes it
    through the rule engine for risk assessment, and stores it in the database.
    """
    try:
        data = await request.json()
        log_id = str(uuid.uuid4())
        data["id"] = log_id
        data["timestamp"] = data.get("timestamp") or datetime.now(
            timezone.utc
        ).isoformat()
        data["received_at"] = datetime.now(timezone.utc).isoformat()
        data["org"] = org  # Tag with org
        alerts, risk = check_all_rules(data)
        data["risk"] = risk

        await insert_log(log_id, data)
        
        # Broadcast new log to all active WebSocket connections
        log_entry_for_ws = LogEntry(**data).dict() # Convert dict to LogEntry model for consistent output
        for connection in active_connections:
            await connection.send_json(log_entry_for_ws)

        # Corrected response to match LogResponse model
        return LogResponse(
            message="Log received and processed successfully",
            log_id=log_id,
            risk=risk,
            alerts=alerts
        )
    except Exception as e:
        logger.exception(f"Error processing log in receive_log: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process log: {str(e)}"
        )

@logs_router.get("/logs", response_model=LogsResponse)
async def get_all_logs(org: str = "example-org") -> LogsResponse:
    """Retrieve all logs for the authenticated organization.

    Returns all log entries regardless of risk level, useful for
    comprehensive monitoring and forensic analysis.
    """
    try:
        logs = await get_logs(min_risk=0)
        return LogsResponse(
            logs=logs,
            total=len(logs),
            page=1,
            per_page=50
        )
    except Exception as e:
        logger.exception(f"Error retrieving logs in get_all_logs: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve logs: {str(e)}"
        )

@logs_router.get("/alerts", response_model=AlertsResponse)
async def get_alerts(
    min_risk: int = Query(80, ge=0, le=100),
    org: str = "example-org" # Removed authentication
) -> AlertsResponse:
    """
    Retrieve high-risk alerts for the authenticated organization.

    Args:
        min_risk: Minimum risk threshold for alerts (0-100)

    Returns alerts that meet or exceed the specified risk threshold,
    enabling focused attention on the most critical security events.
    """
    try:
        logs = await get_logs(min_risk=min_risk)
        # Corrected response to match AlertsResponse model
        return AlertsResponse(
            alerts=logs,
            total=len(logs),
            min_risk=min_risk
        )
    except Exception as e:
        logger.exception(f"Error retrieving alerts in get_alerts: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve alerts: {str(e)}"
        )



