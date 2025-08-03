"""SentinelMesh FastAPI Backend - Security mesh for autonomous AI agents."""

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Request, Query, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext

from rules.rule_engine import check_all_rules

from models import (
    LogEntry,
    LogResponse,
    LogsResponse,
    AlertsResponse,
    StatsResponse,
    HealthResponse,
    ErrorResponse,
    User,
    UserInDB,
    Token,
    TokenData,
    UserCreate,
    UserResponse
)

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s') # Changed to DEBUG
logger = logging.getLogger(__name__)

# Load .env values
load_dotenv()

# DB functions
from sqlite import (
    init_db,
    insert_log,
    get_logs,
    get_agent_stats,
    create_user,
    get_user_by_username
)

# Security settings
SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions for authentication
def verify_password(plain_password, hashed_password):
    logger.debug(f"Verifying password: Plain=\"{plain_password}\" Hashed=\"{hashed_password}\"")
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    hashed_password = pwd_context.hash(password)
    logger.debug(f"Generated hash for password: {hashed_password}")
    return hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str):
    user_data = await get_user_by_username(username)
    if user_data:
        logger.debug(f"User retrieved from DB: {user_data.get("username")} Hashed_password: {user_data.get("hashed_password")}")
        return UserInDB(**user_data)
    logger.debug(f"User {username} not found in DB.")
    return None

async def authenticate_user(username: str, password: str):
    logger.debug(f"Attempting to authenticate user: {username}")
    user = await get_user(username)
    if not user:
        logger.debug(f"Authentication failed: User {username} not found.")
        return False
    if not verify_password(password, user.hashed_password):
        logger.debug(f"Authentication failed: Password mismatch for user {username}.")
        return False
    logger.debug(f"Authentication successful for user: {username}")
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_org(current_user: User = Depends(get_current_user)):
    return current_user.org

app = FastAPI(
    title="SentinelMesh API",
    description="Security mesh for autonomous AI agents",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
origins = [
    "http://localhost:5173",  # For local React development
    "https://pgncwesl.manus.space", # The URL where I deployed the React app (if still in use )
    "http://localhost:3000",  # Alternative React dev server port
    "https://sentinelmesh-frontend.onrender.com", # <--- **ADD YOUR DEPLOYED REACT APP URL HERE**
    # Add any other domains where your frontend might be hosted
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Conditionally mount static files (React build output) if directory exists
STATIC_DIR = "frontend/sentinelmesh-dashboard/dist"
STATIC_INDEX = os.path.join(STATIC_DIR, "index.html")

if os.path.exists(STATIC_DIR):
    app.mount(
        "/static",
        StaticFiles(directory=STATIC_DIR),
        name="static"
    )
    logger.info(f"✅ Static files mounted from {STATIC_DIR}")
else:
    logger.warning(f"⚠️  Static directory {STATIC_DIR} not found - React frontend not available")


@app.on_event("startup")
async def startup_event():
    """Initialize the database on startup."""
    await init_db()
    logger.info("✅ SQLite initialized")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring and load balancers."""
    return HealthResponse(
        status="healthy",
        service="sentinelmesh-api",
        version="0.1.0",
        timestamp=datetime.now(timezone.utc).isoformat(),
        uptime=0 # Changed to a numerical value
    )


# WebSocket management
active_connections: List[WebSocket] = []

@app.websocket("/ws/logs")
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


@app.get("/logs", response_model=LogsResponse)
async def get_all_logs(org: str = Depends(get_current_org)) -> LogsResponse:
    """
    Retrieve all logs for the authenticated organization.

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
        logger.exception(f"Error retrieving statistics in get_statistics: {e}")
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
    logger.error(f"HTTPException: {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            message=exc.detail,
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
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            message="Internal server error",
            error="Internal server error",
            status_code=500,
            timestamp=datetime.now(timezone.utc).isoformat()
        ).dict()
    )


# User registration endpoint
@app.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    try:
        existing_user = await get_user(user.username)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        hashed_password = get_password_hash(user.password)
        await create_user(user.username, hashed_password, user.org)
        return UserResponse(username=user.username, org=user.org)
    except Exception as e:
        logger.exception(f"Error during user registration: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

# User login endpoint
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user = await authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "org": user.org},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException as http_exc:
        # Re-raise HTTPException directly so it\'s handled by http_exception_handler
        raise http_exc
    except Exception as e:
        logger.exception(f"Error during token generation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Token generation failed: {str(e)}"
        )


# Serve React app for all non-API routes (only if React files exist)
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    """
    Serve the React application for all non-API routes.

    This catch-all route ensures that the React router can handle
    client-side routing while preserving API functionality.
    """
    # Only serve React app for non-API routes
    api_routes = ("logs", "alerts", "stats", "log", "static", "health", "docs", "redoc", "ws", "register", "token")
    if not full_path.startswith(api_routes):
        if os.path.exists(STATIC_INDEX):
            return FileResponse(STATIC_INDEX)
        else:
            # If React frontend is not available, return a simple message
            return JSONResponse(
                content={
                    "message": "SentinelMesh API is running",
                    "docs": "/docs",
                    "health": "/health",
                    "frontend": "React frontend not available in this deployment"
                }
            )
    else:
        raise HTTPException(status_code=404, detail="Not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)




