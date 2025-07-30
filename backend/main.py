from fastapi import FastAPI, Request, Query
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
import uuid
from dotenv import load_dotenv
import os
load_dotenv()


from sqlite import (
    init_db,
    insert_log,
    get_logs,
    get_agent_stats
)

from sqlite import get_agent_stats

from fastapi import Depends, HTTPException, status
from backend.auth import get_current_org
# from fastapi.security import HTTPBasic, HTTPBasicCredentials
# import secrets

# security = HTTPBasic()

# USERNAME = os.getenv("SENTINELMESH_USER", "default_user")
# PASSWORD = os.getenv("SENTINELMESH_PASS", "default_pass")


# def verify_auth(credentials: HTTPBasicCredentials = Depends(security)):
#     correct_username = secrets.compare_digest(credentials.username, USERNAME)
#     correct_password = secrets.compare_digest(credentials.password, PASSWORD)
#     if not (correct_username and correct_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="🚫 Unauthorized",
#             headers={"WWW-Authenticate": "Basic"},
#         )



app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✅ SQLite initialized")

@app.post("/log")
# async def receive_log(request: Request, creds: HTTPBasicCredentials = Depends(verify_auth)):
async def receive_log(request: Request, org=Depends(get_current_org)):

    data = await request.json()
    data["org"] = org

    log_id = str(uuid.uuid4())
    data["id"] = log_id
    data["timestamp"] = data.get("timestamp") or datetime.now(timezone.utc).isoformat()
    from rules.rule_engine import check_all_rules  # if not already imported

    alerts, risk = check_all_rules(data)
    data["risk"] = risk

    data["received_at"] = datetime.now(timezone.utc).isoformat()
    await insert_log(log_id, data)
    return {"status": "received", "id": log_id}


@app.get("/logs")
# async def logs(creds: HTTPBasicCredentials = Depends(verify_auth)):
async def logs(org=Depends(get_current_org)):
    logs = await get_logs(min_risk=0)
    return {"logs": logs, "org": org}

@app.get("/alerts")
# async def alerts(min_risk: int = Query(80, ge=0, le=100), creds: HTTPBasicCredentials = Depends(verify_auth)):
async def alerts(min_risk: int = Query(80, ge=0, le=100), org=Depends(get_current_org)):
    alerts = await get_logs(min_risk)
    return {"alerts": alerts}

@app.get("/agents")
# async def agent_summary(creds: HTTPBasicCredentials = Depends(verify_auth)):
async def agent_summary(org=Depends(get_current_org)):
    return {"agents": await get_agent_stats()}


