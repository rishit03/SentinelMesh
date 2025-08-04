
# sentinelmesh/rules/rule_engine.py

import re
from pathlib import Path
import yaml
import logging
from collections import deque
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)

RULE_FILE = Path(__file__).resolve().parent / "rules.yaml"
rules = [] # Initialize rules globally

# In-memory store for recent log entries for stateful rules
# Using a deque for efficient appending and popping from either end
# Max size to prevent unbounded memory growth
RECENT_LOGS = deque(maxlen=1000) # Store up to 1000 recent logs

def load_rules():
    """Loads rules from the YAML file and sorts them by priority."""
    global rules
    try:
        with open(RULE_FILE, "r") as f:
            config = yaml.safe_load(f)
        loaded_rules = config.get("rules", [])
        # Sort rules by priority in descending order (highest priority first)
        rules = sorted(loaded_rules, key=lambda x: x.get("priority", 0), reverse=True)
        logger.info(f"✅ Successfully loaded and sorted {len(rules)} rules from {RULE_FILE}")
    except FileNotFoundError:
        logger.error(f"❌ Rule file not found: {RULE_FILE}")
        rules = []
    except yaml.YAMLError as e:
        logger.error(f"❌ Error parsing YAML in {RULE_FILE}: {e}")
        rules = []
    except Exception as e:
        logger.error(f"❌ An unexpected error occurred while loading rules: {e}")
        rules = []

# Load rules initially when the module is imported
load_rules()

def add_log_to_recent(log_entry: dict):
    """Adds a log entry to the in-memory recent logs store."""
    # Ensure timestamp is a datetime object for comparison
    if isinstance(log_entry.get("timestamp"), str):
        try:
            log_entry["timestamp"] = datetime.fromisoformat(log_entry["timestamp"]).astimezone(timezone.utc)
        except ValueError:
            logger.warning(f"Could not parse timestamp for log: {log_entry.get('id')}")
            return
    RECENT_LOGS.append(log_entry)

def check_sequence(current_log: dict, rule: dict) -> bool:
    """Checks for a sequence of events based on the rule definition.
    This is a simplified implementation for demonstration.
    """
    sequence_config = rule.get("sequence")
    if not sequence_config:
        return False

    # For simplicity, let\'s assume a single event type for now
    # A more robust implementation would iterate through multiple events in the sequence
    event_type = sequence_config[0].get("event_type")
    status = sequence_config[0].get("status")
    count = sequence_config[0].get("count", 1)
    time_window_seconds = sequence_config[0].get("time_window_seconds", 0)

    if not event_type:
        return False

    matched_events = []
    time_window_start = current_log["timestamp"] - timedelta(seconds=time_window_seconds)

    # Iterate through recent logs (newest first for efficiency if many logs)
    # Note: deque iteration is from left (oldest) to right (newest)
    for log in reversed(RECENT_LOGS):
        if log["timestamp"] < time_window_start:
            break # Logs are too old

        # Simplified matching logic: check event_type and status in context/payload
        # A real implementation would have more sophisticated matching
        is_match = False
        if event_type == "login_attempt": # Specific to the example rule
            if "login" in log.get("context", "").lower() or "login" in log.get("payload", "").lower():
                if status == "failed" and ("failed" in log.get("payload", "").lower() or "fail" in log.get("payload", "").lower()):
                    is_match = True
                elif status == "success" and ("success" in log.get("payload", "").lower()):
                    is_match = True

        if is_match:
            matched_events.append(log)

    return len(matched_events) >= count

def check_all_rules(message):
    alerts = []
    # Initialize total_risk with the risk from the incoming message
    total_risk = message.get("risk", 0)
    context = message.get("context", "")
    payload = message.get("payload", "")

    # Add the current message to recent logs for stateful rule evaluation
    add_log_to_recent(message.copy()) # Add a copy to avoid modifying original message

    for rule in rules:
        rule_id = rule.get("id", "unknown")
        risk = rule.get("risk", 0)
        rule_type = rule.get("type")

        if rule_type == "context_block":
            if context in rule["match"]:
                alerts.append({
                    "rule_id": rule_id,
                    "message": f"Context \'{context}\' is blocked by policy.",
                    "risk": risk
                })
                total_risk += risk

        elif rule_type == "payload_contains":
            for phrase in rule["match"]:
                if phrase.lower() in payload.lower():
                    alerts.append({
                        "rule_id": rule_id,
                        "message": f"Payload matched forbidden phrase: \'{phrase}\'",
                        "risk": risk
                    })
                    total_risk += risk

        elif rule_type == "payload_regex":
            pattern = rule["pattern"]
            if re.search(pattern, payload):
                alerts.append({
                    "rule_id": rule_id,
                    "message": f"Payload matched regex pattern: \'{pattern}\'",
                    "risk": risk
                })
                total_risk += risk

        elif rule_type == "sequential_events":
            if check_sequence(message, rule):
                alerts.append({
                    "rule_id": rule_id,
                    "message": rule.get("message", f"Sequential event detected for rule {rule_id}."),
                    "risk": risk
                })
                total_risk += risk

        else:
            logger.warning(f"Unknown rule type encountered: {rule_type} for rule {rule_id}")

    return alerts, min(total_risk, 100)