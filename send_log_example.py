import requests
import json

API_BASE = "https://sentinelmesh-api.onrender.com"

def get_access_token(username, password):
    """Obtains an access token from the API."""
    token_url = f"{API_BASE}/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "username": username,
        "password": password
    }
    response = requests.post(token_url, headers=headers, data=data)
    response.raise_for_status() # Raise an exception for HTTP errors
    return response.json()["access_token"]

def send_log(access_token, log_data):
    """Sends log data to the API."""
    logs_url = f"{API_BASE}/log"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.post(logs_url, headers=headers, data=json.dumps(log_data))
    response.raise_for_status() # Raise an exception for HTTP errors
    return response.json()

if __name__ == "__main__":
    # --- Configuration ---
    YOUR_USERNAME = "rishit03" # Replace with your registered username
    YOUR_PASSWORD = "12345678" # Replace with your password

    # --- Sample Log Data ---
    sample_log = {
        "sender": "python-script",
        "receiver": "dashboard",
        "payload": "Automated log entry from Python script.",
        "context": "Testing log submission from external source.",
        "risk": 30
    }

    try:
        print("Attempting to get access token...")
        token = get_access_token(YOUR_USERNAME, YOUR_PASSWORD)
        print("Access token obtained successfully.")

        print("Sending log data...")
        response = send_log(token, sample_log)
        print("Log sent successfully:", response)

    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e.response.status_code} - {e.response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")