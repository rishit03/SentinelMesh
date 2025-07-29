import streamlit as st
st.set_page_config(page_title="SentinelMesh Remote Dashboard", layout="wide")

from requests.auth import HTTPBasicAuth
import requests
import os
import pandas as pd
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone


load_dotenv()

st.title("🛰️ SentinelMesh Remote Dashboard")

API_BASE = os.getenv("API_BASE", "http://localhost:8000")
LOGS_URL = f"{API_BASE}/logs"
ALERTS_URL = f"{API_BASE}/alerts"
AGENTS_URL = f"{API_BASE}/agents"

# Load credentials from .env
VALID_USER = os.getenv("SENTINELMESH_USER")
VALID_PASS = os.getenv("SENTINELMESH_PASS")

# Initialize session state
if "auth_passed" not in st.session_state:
    st.session_state.auth_passed = False
    st.session_state.auth_obj = None
    st.session_state.login_time = None


# Always prompt for login
if not st.session_state.auth_passed:
    with st.sidebar:
        st.header("🔐 Login Required")
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        login_btn = st.button("Login")

    if login_btn:
        if username == VALID_USER and password == VALID_PASS:
            st.session_state.auth_passed = True
            st.session_state.auth_obj = HTTPBasicAuth(username, password)
            st.session_state.login_time = datetime.now(timezone.utc)
            st.success("✅ Login successful.")
            st.rerun()

        else:
            st.error("🚫 Invalid credentials.")
    st.stop()


# Use verified auth for all future requests
auth = st.session_state.auth_obj

# Session timeout check (15 minutes)
if st.session_state.get("login_time"):
    if datetime.now(timezone.utc) - st.session_state.login_time > timedelta(minutes=15):
        st.warning("🔐 Session expired. Please log in again.")
        st.session_state.auth_passed = False
        st.session_state.auth_obj = None
        st.session_state.login_time = None
        st.experimental_rerun()


# Sidebar: show logged-in user and logout button
with st.sidebar:
    if st.session_state.get("auth_passed"):
        st.markdown(f"👤 Logged in as `{VALID_USER}`")
        if st.button("Logout"):
            st.session_state.auth_passed = False
            st.session_state.auth_obj = None
            st.success("👋 Logged out.")
            st.experimental_rerun()


tab1, tab2, tab3 = st.tabs(["📄 All Logs", "🚨 Alerts Only", "🧠 Agent Overview"])


def fetch_data(url):
    try:
        response = requests.get(url, auth = st.session_state.auth_obj)
        response.raise_for_status()
        return response.json().get("logs" if "logs" in url else "alerts", [])
    except Exception as e:
        st.error(f"Failed to fetch from {url}: {e}")
        return []

with tab1:
    logs = fetch_data(LOGS_URL)
    if logs:
        df = pd.DataFrame(logs)
        df["Timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload"]], use_container_width=True)

        # Export section
        csv = df.to_csv(index=False).encode("utf-8")
        json_text = df.to_json(orient="records", indent=2).encode("utf-8")

        st.download_button("⬇️ Download CSV", data=csv, file_name="sentinelmesh_logs.csv", mime="text/csv", key="log_csv")
        st.download_button("⬇️ Download JSON", data=json_text, file_name="sentinelmesh_logs.json", mime="application/json", key="log_json")


    else:
        st.info("No logs available.")

with tab2:
    min_risk = st.slider("Minimum risk to show", 0, 100, 80)
    alerts = fetch_data(f"{ALERTS_URL}?min_risk={min_risk}")
    if alerts:
        df = pd.DataFrame(alerts)
        df["Timestamp"] = pd.to_datetime(df.get("timestamp"), errors="coerce")
        df = df.dropna(subset=["Timestamp"]).sort_values("Timestamp", ascending=False)
        st.dataframe(df[["Timestamp", "sender", "receiver", "context", "payload", "risk"]], use_container_width=True)
        
        # Export section
        csv = df.to_csv(index=False).encode("utf-8")
        json_text = df.to_json(orient="records", indent=2).encode("utf-8")

        st.download_button("⬇️ Download CSV", data=csv, file_name="sentinelmesh_alerts.csv", mime="text/csv", key="alert_csv")
        st.download_button("⬇️ Download JSON", data=json_text, file_name="sentinelmesh_alerts.json", mime="application/json", key="alert_json")


    else:
        st.success("✅ No alerts above selected threshold.")

with tab3:
    st.subheader("🧠 Agent Risk Summary")
    try:
        response = requests.get(AGENTS_URL, auth = st.session_state.auth_obj)
        agents = response.json().get("agents", [])
        if agents:
            df = pd.DataFrame(agents)
            df["avg_risk"] = df["avg_risk"].round(2)
            st.dataframe(df.rename(columns={
                "sender": "Agent",
                "message_count": "Messages",
                "avg_risk": "Avg Risk"
            }), use_container_width=True)
        else:
            st.info("No agent activity available.")
    except Exception as e:
        st.error(f"Failed to fetch agent stats: {e}")