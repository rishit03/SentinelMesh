"""
Enhanced SentinelMesh FastAPI Application with improved documentation and error handling.
"""

import os
import time
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, Request, status
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# Load .env values
load_dotenv()

# 🔐 Token-based auth
from auth import get_current_org

# Import models
from models import (
    AlertsResponse,
    ErrorResponse,
    HealthResponse,
    LogRequest,
    LogResponse,
    LogsResponse,
    StatsResponse,
)

# Rule engine
from rules.rule_engine import RuleEngine

# DB functions
from sqlite import get_agent_stats, get_logs, init_db, insert_log

# Initialize FastAPI app with enhanced metadata
app = FastAPI(
    title="SentinelMesh API",
    description="""
    **The Security Mesh for Autonomous AI Agents**
    
    SentinelMesh provides real-time risk detection, traffic policies, and forensic 
    observability for AI agents communicating over decentralized protocols like 
    Model Context Protocol (MCP).
    
    ## Features
    
    * **Real-time Risk Detection**: Analyze agent communications for security threats
    * **Customizable Rules**: Define risk scoring rules via YAML configuration
    * **Forensic Observability**: Complete audit trail of agent interactions
    * **Token-based Authentication**: Secure API access with bearer tokens
    * **High Performance**: Built with FastAPI for production workloads
    
    ## Authentication
    
    All endpoints require authentication using a bearer token in the Authorization header:
    ```
    Authorization: Bearer YOUR_API_TOKEN
    ```
    """,
    version="1.0.0",
    contact={
        "name": "Rishit Goel",
        "url": "https://github.com/rishit03/SentinelMesh",
        "email": "rishit.goel@example.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    openapi_tags=[
        {"name": "health", "description": "Health check and service status operations"},
        {"name": "logs", "description": "Log ingestion and retrieval operations"},
        {"name": "alerts", "description": "Alert management and retrieval operations"},
        {"name": "stats", "description": "Statistics and analytics operations"},
    ],
)

# Track startup time for uptime calculation
startup_time = time.time()

# Configure CORS
origins = [
    "http://localhost:5173",  # React development server
    "http://localhost:3000",  # Alternative React dev server
    "https://pgncwesl.manus.space",  # Deployed React app
    "https://sentinelmesh-frontend.onrender.com",  # User's deployed React frontend
    # Add any other domains where your frontend might be hosted
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount static files (React build output) if directory exists
static_dir = "static_frontend"
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Initialize rule engine
try:
    rule_engine = RuleEngine("rules/rules.yaml")
except Exception as e:
    print(f"⚠️  Warning: Could not load rule engine: {e}")
    rule_engine = None


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom validation error handler."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "ValidationError",
            "message": "Invalid request data",
            "details": exc.errors(),
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.__class__.__name__,
            "message": exc.detail,
            "details": None,
        },
    )


@app.on_event("startup")
async def startup_event():
    """Initialize the application on startup."""
    await init_db()
    print("✅ SQLite initialized")
    print("🚀 SentinelMesh API started successfully")


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["health"],
    summary="Health Check",
    description="Check the health status of the SentinelMesh API service.",
)
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    Returns service status, version, and uptime information.
    """
    return HealthResponse(
        status="healthy",
        service="sentinelmesh-api",
        timestamp=datetime.now(timezone.utc).isoformat(),
        version="1.0.0",
        uptime=time.time() - startup_time,
    )


@app.post(
    "/log",
    response_model=LogResponse,
    tags=["logs"],
    summary="Ingest Log",
    description="Submit a log entry for risk analysis and storage.",
    responses={
        200: {"description": "Log successfully processed"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
        422: {"model": ErrorResponse, "description": "Invalid request data"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def ingest_log(log_data: LogRequest, org=Depends(get_current_org)):
    """
    Ingest a log entry from an AI agent.

    The log will be:
    1. Validated for required fields
    2. Analyzed by the rule engine for risk scoring
    3. Stored in the database with calculated risk and alerts
    4. Response includes the risk score and any triggered alerts
    """
    try:
        # Generate unique ID and timestamp
        log_id = str(uuid.uuid4())
        received_at = datetime.now(timezone.utc).isoformat()

        # Use provided timestamp or current time
        if log_data.timestamp:
            timestamp = log_data.timestamp
        else:
            timestamp = received_at

        # Prepare log entry
        log_entry = {
            "id": log_id,
            "sender": log_data.sender,
            "receiver": log_data.receiver,
            "context": log_data.context,
            "payload": log_data.payload,
            "timestamp": timestamp,
            "received_at": received_at,
            "org": org,
        }

        # Apply rule engine if available
        risk = 0
        alerts = []
        if rule_engine:
            try:
                risk, alerts = rule_engine.evaluate_log(log_entry)
            except Exception as e:
                print(f"⚠️  Rule engine error: {e}")

        log_entry["risk"] = risk

        # Store in database
        await insert_log(log_entry)

        print(f"📝 Log {log_id} processed with risk score: {risk}")

        return LogResponse(
            message="Log received and processed",
            log_id=log_id,
            risk=risk,
            alerts=alerts,
        )

    except Exception as e:
        print(f"❌ Error processing log: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process log: {str(e)}",
        )


@app.get(
    "/logs",
    response_model=LogsResponse,
    tags=["logs"],
    summary="Retrieve Logs",
    description="Retrieve log entries with optional filtering and pagination.",
    responses={
        200: {"description": "Logs retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
)
async def get_logs_endpoint(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(50, ge=1, le=1000, description="Logs per page"),
    sender: Optional[str] = Query(None, description="Filter by sender"),
    context: Optional[str] = Query(None, description="Filter by context"),
    min_risk: Optional[int] = Query(
        None, ge=0, le=100, description="Minimum risk score"
    ),
    org=Depends(get_current_org),
):
    """
    Retrieve log entries with optional filtering and pagination.

    Supports filtering by sender, context, and minimum risk score.
    Results are paginated for performance.
    """
    try:
        # Calculate offset
        offset = (page - 1) * per_page

        # Get logs with filters
        logs = await get_logs(
            org=org,
            limit=per_page,
            offset=offset,
            sender=sender,
            context=context,
            min_risk=min_risk,
        )

        # Get total count (simplified - in production, you'd want a separate count query)
        total_logs = await get_logs(org=org)
        total = len(total_logs)

        return LogsResponse(logs=logs, total=total, page=page, per_page=per_page)

    except Exception as e:
        print(f"❌ Error retrieving logs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve logs: {str(e)}",
        )


@app.get(
    "/alerts",
    response_model=AlertsResponse,
    tags=["alerts"],
    summary="Retrieve Alerts",
    description="Retrieve high-risk log entries that triggered security alerts.",
    responses={
        200: {"description": "Alerts retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
)
async def get_alerts_endpoint(
    min_risk: int = Query(80, ge=0, le=100, description="Minimum risk threshold"),
    org=Depends(get_current_org),
):
    """
    Retrieve alerts (high-risk log entries).

    Returns log entries that exceed the specified risk threshold,
    indicating potential security concerns that require attention.
    """
    try:
        # Get high-risk logs
        alerts = await get_logs(org=org, min_risk=min_risk)

        # Add rule_matches field (simplified - in production, store this in DB)
        for alert in alerts:
            alert["rule_matches"] = []  # Would contain actual rule match details

        return AlertsResponse(alerts=alerts, total=len(alerts), min_risk=min_risk)

    except Exception as e:
        print(f"❌ Error retrieving alerts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve alerts: {str(e)}",
        )


@app.get(
    "/stats",
    response_model=StatsResponse,
    tags=["stats"],
    summary="Get Statistics",
    description="Retrieve comprehensive statistics about agent activity and security metrics.",
    responses={
        200: {"description": "Statistics retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Authentication required"},
    },
)
async def get_stats_endpoint(org=Depends(get_current_org)):
    """
    Get comprehensive statistics about agent activity.

    Includes metrics such as:
    - Total logs and alerts
    - Active agent count
    - Average risk scores
    - Top senders
    - Risk distribution
    """
    try:
        stats = await get_agent_stats()

        return StatsResponse(stats=stats, org=org)

    except Exception as e:
        print(f"❌ Error retrieving stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve statistics: {str(e)}",
        )


# Serve React app for all non-API routes (if static files exist)
if os.path.exists(static_dir):

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all non-API routes."""
        # Only serve React app for non-API routes
        if not full_path.startswith(
            (
                "logs",
                "alerts",
                "stats",
                "log",
                "static",
                "health",
                "docs",
                "redoc",
                "openapi.json",
            )
        ):
            return FileResponse(f"{static_dir}/index.html")
        else:
            raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
