import requests
import json
import os
from datetime import datetime, timezone

# --- Configuration ---
# Replace with your actual FastAPI backend URL
FASTAPI_BACKEND_URL = os.getenv("FASTAPI_BACKEND_URL", "https://sentinelmesh-api.onrender.com")
# Replace with your actual API token
API_TOKEN = os.getenv("SENTINELMESH_TOKEN", "rishit-org-token")

LOG_ENDPOINT = f"{FASTAPI_BACKEND_URL}/log"
HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

# --- Sample Log Data ---
def generate_log_data(sender, receiver, context, payload):
    return {
        "sender": sender,
        "receiver": receiver,
        "context": context,
        "payload": payload,
        "timestamp": datetime.now(timezone.utc).isoformat() # Optional: provide a timestamp
    }

# --- Send Log Function ---
def send_log(log_data):
    try:
        response = requests.post(LOG_ENDPOINT, headers=HEADERS, data=json.dumps(log_data))
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
        print("Log sent successfully!")
        print("Response:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error sending log: {e}")
        if response is not None:
            print(f"Status Code: {response.status_code}")
            print(f"Response Body: {response.text}")

# --- Example Usage ---
if __name__ == "__main__":
    # Example 1: A simple heartbeat log
    log1 = generate_log_data(
        sender="agent-alpha",
        receiver="central-server",
        context="heartbeat",
        payload="Agent Alpha is online and operational."
    )
    print("\n--- Sending Log 1 ---")
    send_log(log1)

    # Example 2: A security event log
    log2 = generate_log_data(
        sender="firewall-01",
        receiver="security-team",
        context="security-alert",
        payload="Unauthorized access attempt detected from IP 192.168.1.100."
    )
    print("\n--- Sending Log 2 ---")
    send_log(log2)

    # Example 3: A system error log
    log3 = generate_log_data(
        sender="database-server",
        receiver="sysadmin",
        context="system-error",
        payload="Database connection pool exhausted. Restarting service."
    )
    print("\n--- Sending Log 3 ---")
    send_log(log3)

    # Example 4: Log with a custom timestamp
    custom_timestamp_log = {
        "sender": "sensor-node-05",
        "receiver": "data-lake",
        "context": "environmental-data",
        "payload": "Temperature: 25C, Humidity: 60%",
        "timestamp": "2025-07-30T15:45:00.000Z"
    }
    print("\n--- Sending Log 4 (Custom Timestamp) ---")
    send_log(custom_timestamp_log)