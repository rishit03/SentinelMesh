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

API_TOKEN = os.getenv("SENTINELMESH_TOKEN", "rishit-org-token")
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# Tabs
tab1, tab2, tab3 = st.tabs(["📄 All Logs", "🚨 Alerts Only", "🧠 Agent Overview"])

def fetch_data(url):
    try:
        res = requests.get(url, headers=HEADERS)
        res.raise_for_status()
        return res.json().get("logs" if "logs" in url else "alerts", [])
    except Exception as e:
        st.error(f"Failed to fetch from {url}: {e}")
        return []

# 📄 All Logs
with tab1:
    logs = fetch_data(LOGS_URL)
    if logs:
        df = pd.DataFrame(logs)
        df["Timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload"]], use_container_width=True)

        # Export buttons
        csv = df.to_csv(index=False).encode("utf-8")
        json_text = df.to_json(orient="records", indent=2).encode("utf-8")
        st.download_button("⬇️ Download CSV", data=csv, file_name="sentinelmesh_logs.csv", mime="text/csv")
        st.download_button("⬇️ Download JSON", data=json_text, file_name="sentinelmesh_logs.json", mime="application/json")
    else:
        st.info("No logs available.")

# 🚨 Alerts Only
with tab2:
    st.subheader("📉 Filter by Minimum Risk Score")
    min_risk = st.slider("Minimum Risk", min_value=0, max_value=100, value=80, step=5)
    alerts = fetch_data(f"{ALERTS_URL}?min_risk={min_risk}")
    if alerts:
        df = pd.DataFrame(alerts)
        df["Timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload", "risk"]], use_container_width=True)
    else:
        st.info("No alerts found for selected risk level.")

# 🧠 Agent Overview
with tab3:
    logs = fetch_data(LOGS_URL)
    if logs:
        df = pd.DataFrame(logs)
        df["Timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
        agent_stats = df.groupby("sender").agg(
            Msg_Count=("sender", "count"),
            First_Seen=("Timestamp", "min"),
            Last_Seen=("Timestamp", "max")
        ).reset_index().rename(columns={"sender": "Agent"})

        st.bar_chart(agent_stats.set_index("Agent")["Msg_Count"])
        st.dataframe(agent_stats, use_container_width=True)
    else:
        st.info("Not enough data to show agent stats.")

# Footer
st.markdown("---")
st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC")
