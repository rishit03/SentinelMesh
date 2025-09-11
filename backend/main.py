import os
import logging
from datetime import datetime, timezone
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from sqlite import init_db
from models import HealthResponse, ErrorResponse

from routers.auth import auth_router
from routers.logs import logs_router
from routers.stats import stats_router
from routers.users import users_router

# Configure logging
logging.basicConfig(level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Load .env values
load_dotenv()

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


# Include routers
app.include_router(auth_router)
app.include_router(logs_router)
app.include_router(stats_router)
app.include_router(users_router)


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


