"""SentinelMesh FastAPI Backend - Security mesh for autonomous AI agents."""

import os
import uuid
from datetime import datetime, timezone
from typing import Dict, Any

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Query, Depends, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from models import (
    LogEntry,
    LogResponse,
    LogsResponse,
    AlertsResponse,
    StatsResponse,
    HealthResponse,
    ErrorResponse,
)

# Load .env values
load_dotenv()

# DB functions
from sqlite import (
    init_db,
    insert_log,
    get_logs,
    get_agent_stats
)

# Token-based auth
from auth import get_current_org

app = FastAPI(
    title="SentinelMesh API",
    description="Security mesh for autonomous AI agents",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Allow your local React development server
    "https://pgncwesl.manus.space",  # Allow the deployed React app
    "http://localhost:3000",  # Alternative React dev server port
    # Add any other domains where your frontend might be hosted
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
 )

# Mount static files (React build output)
# Update this path to point to your React app\'s dist folder
app.mount(
    "/static",
    StaticFiles(directory="frontend/sentinelmesh-dashboard/dist"),
    name="static"
)


@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup."""
    await init_db()
    print("✅ SQLite initialized")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring and load balancers."""
    return HealthResponse(
        status="healthy",
        version="0.1.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
        uptime="unknown"
    )


@app.post("/log", response_model=LogResponse)
async def receive_log(
    request: Request,
    org: str = Depends(get_current_org)
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

        # Import rule engine here (dynamic)
        from rules.rule_engine import check_all_rules
        alerts, risk = check_all_rules(data)
        data["risk"] = risk

        await insert_log(log_id, data)
        return LogResponse(
            status="received",
            id=log_id,
            risk=risk,
            org=org
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process log: {str(e)}"
        )


@app.get("/logs", response_model=LogsResponse)
async def get_all_logs(org: str = Depends(get_current_org)) -> LogsResponse:
    """
    Retrieve all logs for the authenticated organization.

    Returns all log entries regardless of risk level, useful for
    comprehensive monitoring and forensic analysis.
    """
    try:
        logs = await get_logs(min_risk=0)
        return LogsResponse(logs=logs, org=org)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve logs: {str(e)}"
        )


@app.get("/alerts", response_model=AlertsResponse)
async def get_alerts(
    min_risk: int = Query(80, ge=0, le=100),
    org: str = Depends(get_current_org)
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
        return AlertsResponse(alerts=logs, org=org)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve alerts: {str(e)}"
        )


@app.get("/stats", response_model=StatsResponse)
async def get_statistics(
    org: str = Depends(get_current_org)
) -> StatsResponse:
    """
    Retrieve aggregated statistics for the authenticated organization.

    Returns comprehensive metrics including agent activity, risk distribution,
    and system health indicators for operational dashboards.
    """
    try:
        stats = await get_agent_stats()
        return StatsResponse(stats=stats, org=org)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(
    request: Request,
    exc: HTTPException
 ) -> JSONResponse:
    """Handle HTTP exceptions with structured error responses."""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            status_code=exc.status_code,
            timestamp=datetime.now(timezone.utc).isoformat()
        ).dict()
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    """Handle general exceptions with structured error responses."""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            status_code=500,
            timestamp=datetime.now(timezone.utc).isoformat()
        ).dict()
    )


# Serve React app for all non-API routes
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """
    Serve the React application for all non-API routes.

    This catch-all route ensures that the React router can handle
    client-side routing while preserving API functionality.
    """
    # Only serve React app for non-API routes
    api_routes = ("logs", "alerts", "stats", "log", "static", "health", "docs")
    if not full_path.startswith(api_routes):
        return FileResponse("frontend/sentinelmesh-dashboard/dist/index.html")
    else:
        raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)