from fastapi import FastAPI, Request, Query, Depends, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
import os

# Load .env values
load_dotenv()

# DB functions
from sqlite import (
    init_db,
    insert_log,
    get_logs,
    get_agent_stats
)

# 🔐 Token-based auth
from auth import get_current_org

app = FastAPI()

# Configure CORS - UPDATED VERSION TO FIX 405 OPTIONS ERROR
origins = [
    "http://localhost:5173",  # Allow your local React development server
    "https://pgncwesl.manus.space",  # Allow the deployed React app
    "http://localhost:3000",  # Alternative React dev server port
    # Add any other domains where your frontend might be hosted
    # e.g., "https://your-custom-frontend-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Explicitly include OPTIONS
    allow_headers=["*"],
)

# Mount static files (React build output)
# Update this path to point to your React app's dist folder
# Ensure this path is correct relative to where your FastAPI app runs
app.mount("/static", StaticFiles(directory="static_frontend"), name="static")

@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✅ SQLite initialized")

# Log ingestion endpoint
@app.post("/log")
async def receive_log(request: Request, org=Depends(get_current_org)):
    data = await request.json()
    log_id = str(uuid.uuid4())
    data["id"] = log_id
    data["timestamp"] = data.get("timestamp") or datetime.now(timezone.utc).isoformat()
    data["received_at"] = datetime.now(timezone.utc).isoformat()
    data["org"] = org  # Tag with org

    # Import rule engine here (dynamic)
    from rules.rule_engine import check_all_rules
    alerts, risk = check_all_rules(data)
    data["risk"] = risk

    await insert_log(log_id, data)
    return {"status": "received", "id": log_id, "risk": risk, "org": org}

# View all logs
@app.get("/logs")
async def logs(org=Depends(get_current_org)):
    logs = await get_logs(min_risk=0)
    return {"logs": logs, "org": org}

# View alerts only (risk >= threshold)
@app.get("/alerts")
async def alerts(min_risk: int = Query(80, ge=0, le=100), org=Depends(get_current_org)):
    logs = await get_logs(min_risk=min_risk)
    return {"alerts": logs, "org": org}

# Optional: Agent stats route
@app.get("/stats")
async def stats(org=Depends(get_current_org)):
    stats = await get_agent_stats()
    return {"stats": stats, "org": org}

# Serve React app for all non-API routes
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Only serve React app for non-API routes
    if not full_path.startswith(("logs", "alerts", "stats", "log", "static")):
        return FileResponse("static_frontend/index.html")
    else:
        raise HTTPException(status_code=404, detail="Not found")