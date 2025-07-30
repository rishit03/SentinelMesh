from fastapi import FastAPI, Request, Query, Depends, HTTPException
from fastapi.responses import JSONResponse
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
from auth import get_current_org  # ✅ use token-based auth now

app = FastAPI()

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
