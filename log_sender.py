import requests
import json
import os
from datetime import datetime, timezone, timedelta

class SentinelMeshLogSender:
    def __init__(self, api_base=None, username=None, password=None, access_token=None):
        self.api_base = api_base or os.getenv("SENTINELMESH_API_BASE", "https://sentinelmesh-api.onrender.com")
        self._username = username
        self._password = password
        self._access_token = access_token
        self._token_expiry = None

    def _is_token_valid(self):
        if not self._access_token or not self._token_expiry:
            return False
        # Check if token expires in the next 5 minutes
        return self._token_expiry > datetime.now(timezone.utc) + timedelta(minutes=5)

    def _decode_jwt(self, jwt_token):
        try:
            import base64
            payload = json.loads(base64.b64decode(jwt_token.split(".")[1] + "==").decode("utf-8"))
            return {
                "username": payload.get("sub"),
                "org": payload.get("org"),
                "exp": datetime.fromtimestamp(payload.get("exp"), tz=timezone.utc)
            }
        except Exception as e:
            print(f"Error decoding JWT: {e}")
            return None

    def get_access_token(self, username=None, password=None):
        """Obtains an access token from the API, refreshing if necessary."""
        if username: self._username = username
        if password: self._password = password

        if self._access_token and self._is_token_valid():
            return self._access_token

        if not self._username or not self._password:
            raise ValueError("Username and password must be provided for token acquisition.")

        token_url = f"{self.api_base}/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "username": self._username,
            "password": self._password
        }
        try:
            response = requests.post(token_url, headers=headers, data=data)
            response.raise_for_status() # Raise an exception for HTTP errors
            token_data = response.json()
            self._access_token = token_data["access_token"]
            decoded_token = self._decode_jwt(self._access_token)
            if decoded_token: self._token_expiry = decoded_token["exp"]
            return self._access_token
        except requests.exceptions.RequestException as e:
            print(f"Error getting access token: {e}")
            raise

    def send_log(self, log_data):
        """Sends log data to the API."""
        if not self._access_token or not self._is_token_valid():
            print("Access token expired or not available. Attempting to refresh...")
            self.get_access_token() # Attempt to get a new token

        if not self._access_token:
            raise Exception("Failed to obtain access token for sending log.")

        logs_url = f"{self.api_base}/log" # Use /log for POST
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._access_token}"
        }
        try:
            response = requests.post(logs_url, headers=headers, data=json.dumps(log_data))
            response.raise_for_status() # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 401: # Token might have just expired
                print("401 Unauthorized. Attempting token refresh and retry...")
                self._access_token = None # Invalidate current token
                self.get_access_token() # Get a new token
                headers["Authorization"] = f"Bearer {self._access_token}"
                response = requests.post(logs_url, headers=headers, data=json.dumps(log_data))
                response.raise_for_status()
                return response.json()
            else:
                print(f"HTTP Error sending log: {e.response.status_code} - {e.response.text}")
                raise
        except requests.exceptions.RequestException as e:
            print(f"Request Error sending log: {e}")
            raise

# Example Usage (for testing the module directly)
if __name__ == "__main__":
    from datetime import timedelta

    # --- Configuration ---
    # Replace with your registered username and password
    # It's recommended to use environment variables in production
    USERNAME = os.getenv("SENTINELMESH_USERNAME", "rishit03")
    PASSWORD = os.getenv("SENTINELMESH_PASSWORD", "12345678")

    sender = SentinelMeshLogSender(username=USERNAME, password=PASSWORD)

    # --- Sample Log Data ---
    sample_log = {
        "sender": "python-agent-module",
        "receiver": "dashboard",
        "payload": "Log sent from reusable Python module.",
        "context": "Automated submission test.",
        "risk": 45
    }

    try:
        print("Initializing log sender and getting token...")
        sender.get_access_token() # Get token on initialization
        print("Token acquired. Sending log...")
        response = sender.send_log(sample_log)
        print("Log sent successfully:", response)

        # Simulate token expiry and retry
        print("\nSimulating token expiry and sending another log...")
        sender._token_expiry = datetime.now(timezone.utc) - timedelta(hours=1) # Force expiry
        sample_log_2 = {
            "sender": "python-agent-module-expired-token",
            "receiver": "dashboard",
            "payload": "Log sent with simulated expired token.",
            "context": "Testing token refresh.",
            "risk": 60
        }
        response_2 = sender.send_log(sample_log_2)
        print("Second log sent successfully (with refresh):", response_2)

    except Exception as e:
        print(f"An error occurred: {e}")


