"""Tests for the curriculum endpoint."""

import json

from fastapi.testclient import TestClient

from ankiaicardcreationtoolboxbackend.main import app

client = TestClient(app)


def test_get_curriculum_ok(tmp_path, monkeypatch):
    """Verify that /curriculum returns valid JSON when the file exists."""
    curriculum_file = tmp_path / "curriculum.json"
    curriculum_file.write_text(json.dumps({"schemaVersion": "1.0", "tracks": []}))

    monkeypatch.setattr("ankiaicardcreationtoolboxbackend.main.CURRICULUM_PATH", curriculum_file)

    response = client.get("/curriculum")
    assert response.status_code == 200
    data = response.json()
    assert data["schemaVersion"] == "1.0"


def test_get_curriculum_not_found(tmp_path, monkeypatch):
    """Verify that /curriculum returns 404 when the file is missing."""
    monkeypatch.setattr(
        "ankiaicardcreationtoolboxbackend.main.CURRICULUM_PATH",
        tmp_path / "missing.json",
    )

    response = client.get("/curriculum")
    assert response.status_code == 404
