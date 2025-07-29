import uuid

store_log_cache = {}

def store_log_entry(log_id, log_data):
    store_log_cache[log_id] = log_data

def get_all_logs():
    return list(store_log_cache.values())

def get_alerts(min_risk=80):
    return [log for log in store_log_cache.values() if log.get("risk", 0) >= min_risk]

def clear_logs():
    store_log_cache.clear()

from pathlib import Path
import json

LOG_PATH = Path("logs/sentinelmesh-stream.jsonl")

def persist_log(log_data):
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(log_data) + "\n")

def load_logs_from_disk():
    if not LOG_PATH.exists():
        return

    with open(LOG_PATH, "r") as f:
        for line in f:
            try:
                log = json.loads(line.strip())
                log_id = log.get("id") or str(uuid.uuid4())
                store_log_entry(log_id, log)
            except Exception as e:
                print(f"❌ Failed to load log line: {e}")