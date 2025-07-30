import streamlit as st
st.set_page_config(page_title="SentinelMesh Remote Dashboard", layout="wide")

import requests
import os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

st.title("🛰️ SentinelMesh Remote Dashboard")

API_BASE = os.getenv("API_BASE", "https://sentinelmesh-api.onrender.com")
LOGS_URL = f"{API_BASE}/logs"
ALERTS_URL = f"{API_BASE}/alerts"
AGENTS_URL = f"{API_BASE}/agents"

# 🔐 Bearer token auth (from .env or hardcoded fallback)
API_TOKEN = os.getenv("SENTINELMESH_TOKEN", "rishit-org-token")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# Fetch logs
try:
    log_res = requests.get(LOGS_URL, headers=HEADERS)
    log_res.raise_for_status()
    logs = log_res.json().get("logs", [])
except Exception as e:
    st.error(f"❌ Failed to fetch logs: {e}")
    st.stop()

# Fetch alerts
try:
    alert_res = requests.get(ALERTS_URL, headers=HEADERS)
    alert_res.raise_for_status()
    alerts = alert_res.json().get("alerts", [])
except Exception as e:
    st.error(f"❌ Failed to fetch alerts: {e}")
    st.stop()

# ─────────────────────────────── UI ───────────────────────────────

st.markdown("---")
st.subheader("🚨 High-Risk Alerts")

if alerts:
    df_alerts = pd.DataFrame(alerts)
    st.dataframe(df_alerts, use_container_width=True)
else:
    st.info("No high-risk alerts found.")

st.markdown("---")
st.subheader("📜 All Agent Logs")

if logs:
    df_logs = pd.DataFrame(logs)
    st.dataframe(df_logs, use_container_width=True)
else:
    st.info("No logs found.")

# Footer
st.markdown("---")
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC")
