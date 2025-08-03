"""
Tests for the rule engine functionality.
"""

from unittest.mock import mock_open, patch

import pytest
import yaml

from rules.rule_engine import RuleEngine


@pytest.fixture
def sample_rules():
    """Sample rules for testing."""
    return {
        "rules": [
            {
                "id": "test_context_block",
                "type": "context_block",
                "match": ["sensitive_context"],
                "risk": 50,
            },
            {
                "id": "test_payload_contains",
                "type": "payload_contains",
                "match": ["malicious_keyword"],
                "risk": 80,
            },
            {
                "id": "test_payload_regex",
                "type": "payload_regex",
                "pattern": r"https?://[^\s]+",
                "risk": 30,
            },
        ]
    }


@pytest.fixture
def rule_engine(sample_rules):
    """Create a rule engine instance with sample rules."""
    with patch("builtins.open", mock_open(read_data=yaml.dump(sample_rules))):
        return RuleEngine("fake_rules_path.yaml")


class TestRuleEngine:
    """Tests for the RuleEngine class."""

    def test_rule_engine_initialization(self, sample_rules):
        """Test that rule engine initializes correctly."""
        with patch("builtins.open", mock_open(read_data=yaml.dump(sample_rules))):
            engine = RuleEngine("fake_rules_path.yaml")
            assert len(engine.rules) == 3

    def test_context_block_rule(self, rule_engine):
        """Test context block rule matching."""
        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "sensitive_context",
            "payload": "normal payload",
        }

        risk, alerts = rule_engine.evaluate_log(log_data)
        assert risk == 50
        assert len(alerts) == 1
        assert alerts[0]["rule_id"] == "test_context_block"

    def test_payload_contains_rule(self, rule_engine):
        """Test payload contains rule matching."""
        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "normal_context",
            "payload": "This contains malicious_keyword in the text",
        }

        risk, alerts = rule_engine.evaluate_log(log_data)
        assert risk == 80
        assert len(alerts) == 1
        assert alerts[0]["rule_id"] == "test_payload_contains"

    def test_payload_regex_rule(self, rule_engine):
        """Test payload regex rule matching."""
        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "normal_context",
            "payload": "Check out this link: https://example.com",
        }

        risk, alerts = rule_engine.evaluate_log(log_data)
        assert risk == 30
        assert len(alerts) == 1
        assert alerts[0]["rule_id"] == "test_payload_regex"

    def test_multiple_rule_matches(self, rule_engine):
        """Test when multiple rules match."""
        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "sensitive_context",
            "payload": "This has malicious_keyword and https://evil.com",
        }

        risk, alerts = rule_engine.evaluate_log(log_data)
        # Should return the highest risk score
        assert risk == 80  # highest among 50, 80, 30
        assert len(alerts) == 3  # all three rules should match

    def test_no_rule_matches(self, rule_engine):
        """Test when no rules match."""
        log_data = {
            "sender": "test-agent",
            "receiver": "test-receiver",
            "context": "normal_context",
            "payload": "completely normal payload",
        }

        risk, alerts = rule_engine.evaluate_log(log_data)
        assert risk == 0
        assert len(alerts) == 0

    def test_invalid_rule_type(self, sample_rules):
        """Test handling of invalid rule types."""
        sample_rules["rules"].append(
            {
                "id": "invalid_rule",
                "type": "invalid_type",
                "match": ["test"],
                "risk": 10,
            }
        )

        with patch("builtins.open", mock_open(read_data=yaml.dump(sample_rules))):
            engine = RuleEngine("fake_rules_path.yaml")

            log_data = {
                "sender": "test-agent",
                "receiver": "test-receiver",
                "context": "test",
                "payload": "test",
            }

            # Should not crash, just ignore invalid rule
            risk, alerts = engine.evaluate_log(log_data)
            assert isinstance(risk, int)
            assert isinstance(alerts, list)

    def test_missing_rules_file(self):
        """Test handling of missing rules file."""
        with patch("builtins.open", side_effect=FileNotFoundError):
            with pytest.raises(FileNotFoundError):
                RuleEngine("nonexistent_rules.yaml")

    def test_invalid_yaml_format(self):
        """Test handling of invalid YAML format."""
        with patch("builtins.open", mock_open(read_data="invalid: yaml: content:")):
            with pytest.raises(yaml.YAMLError):
                RuleEngine("invalid_rules.yaml")
