import streamlit as st
import requests
import os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime

st.set_page_config(page_title="SentinelMesh Remote Dashboard", layout="wide")

load_dotenv()

st.title("🛰️ SentinelMesh Remote Dashboard")

API_BASE = os.getenv("API_BASE", "https://sentinelmesh-api.onrender.com")
LOGS_URL = f"{API_BASE}/logs"
ALERTS_URL = f"{API_BASE}/alerts"
STATS_URL = f"{API_BASE}/stats"

# 🔐 Token-based auth
API_TOKEN = os.getenv("SENTINELMESH_TOKEN", "rishit-org-token")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# ────────────────────────────────────────────────────────────────
# UI Tabs
tab1, tab2, tab3 = st.tabs(["📄 All Logs", "🚨 Alerts Only", "🧠 Agent Overview"])

# Helper to fetch logs or alerts
def fetch_data(url):
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json().get("logs" if "logs" in url else "alerts", [])
    except Exception as e:
        st.error(f"Failed to fetch from {url}: {e}")
        return []

# 📄 All Logs
with tab1:
    logs = fetch_data(LOGS_URL)
    if logs:
        df = pd.DataFrame(logs)
        df['Timestamp'] = pd.to_datetime(df.get("timestamp"), errors='coerce')
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload"]], use_container_width=True)

        # Export buttons
        csv = df.to_csv(index=False).encode('utf-8')
        json_text = df.to_json(orient="records", indent=2).encode("utf-8")
        st.download_button("⬇️ Download CSV", data=csv, file_name="sentinelmesh_logs.csv", mime="text/csv")
        st.download_button("⬇️ Download JSON", data=json_text, file_name="sentinelmesh_logs.json", mime="application/json")
    else:
        st.info("No logs available.")

# 🚨 Alerts
with tab2:
    alerts = fetch_data(ALERTS_URL)
    if alerts:
        df = pd.DataFrame(alerts)
        df['Timestamp'] = pd.to_datetime(df.get("timestamp"), errors='coerce')
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload", "risk"]], use_container_width=True)
    else:
        st.info("No alerts found.")

# 🧠 Agent Overview
with tab3:
    logs = fetch_data(LOGS_URL)
    if logs:
        df = pd.DataFrame(logs)
        agent_counts = df["sender"].value_counts().reset_index()
        agent_counts.columns = ["Agent", "Messages Sent"]
        st.bar_chart(agent_counts.set_index("Agent"))
    else:
        st.info("Not enough data for agent overview.")

# Footer
st.markdown("---")
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC")
