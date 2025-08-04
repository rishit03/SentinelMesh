import time
import random
from datetime import datetime, timezone
from log_sender import SentinelMeshLogSender
import os

# --- Configuration for the Agent ---
# It's recommended to use environment variables for sensitive info in real agents
AGENT_NAME = os.getenv("AGENT_NAME", "AI-Agent-Gamma")
AGENT_ORG = os.getenv("AGENT_ORG", "rishit-org") # This should match the org of the user used for authentication

# Authentication credentials for the log sender
# In a real scenario, these might be loaded from a secure vault or environment variables
SENTINELMESH_USERNAME = os.getenv("SENTINELMESH_USERNAME", "rishit12") # Replace with your registered username
SENTINELMESH_PASSWORD = os.getenv("SENTINELMESH_PASSWORD", "12345678") # Replace with your password

# Initialize the log sender
try:
    log_sender = SentinelMeshLogSender(
        username=SENTINELMESH_USERNAME,
        password=SENTINELMESH_PASSWORD
    )
    # Pre-authenticate to ensure token is ready
    log_sender.get_access_token()
    print(f"[{AGENT_NAME}] Log sender initialized and authenticated.")
except Exception as e:
    print(f"[{AGENT_NAME}] Failed to initialize log sender: {e}")
    print("Please ensure your username/password are correct and the API is accessible.")
    exit(1)

def simulate_agent_activity():
    """Simulates various activities of an AI agent and generates logs."""
    activities = [
        {"payload": "Scanning network segment A for anomalies.", "context": "Network monitoring", "risk": random.randint(10, 30)},
        {"payload": "Detected unusual login attempt from external IP.", "context": "Authentication system", "risk": random.randint(70, 95)},
        {"payload": "Processing data batch #12345.", "context": "Data pipeline", "risk": random.randint(5, 15)},
        {"payload": "Applying security patch CVE-2023-XXXX.", "context": "System maintenance", "risk": random.randint(20, 40)},
        {"payload": "Identified potential phishing email in inbox of user X.", "context": "Email security", "risk": random.randint(80, 99)},
        {"payload": "Generated daily security report.", "context": "Reporting", "risk": random.randint(0, 10)},
        {"payload": "Resource utilization exceeding threshold for service Y.", "context": "Resource management", "risk": random.randint(50, 75)},
    ]
    return random.choice(activities)

def run_agent_loop(iterations=5):
    """Runs a simulated agent loop, sending logs to SentinelMesh."""
    print(f"\n[{AGENT_NAME}] Starting simulated agent activity loop...")
    for i in range(iterations):
        print(f"[{AGENT_NAME}] Iteration {i+1}/{iterations}...")
        activity = simulate_agent_activity()
        
        log_data = {
            "sender": AGENT_NAME,
            "receiver": "SentinelMesh-Dashboard",
            "payload": activity["payload"],
            "context": activity["context"],
            "risk": activity["risk"],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        try:
            print(f"[{AGENT_NAME}] Sending log: {log_data["payload"]}")
            response = log_sender.send_log(log_data)
            print(f"[{AGENT_NAME}] Log sent successfully. ID: {response.get("id")}, Risk: {response.get("risk")}")
        except Exception as e:
            print(f"[{AGENT_NAME}] Error sending log: {e}")
        
        time.sleep(random.uniform(2, 5)) # Simulate work between logs

    print(f"[{AGENT_NAME}] Simulated agent activity loop finished.")

if __name__ == "__main__":
    run_agent_loop(iterations=5)


