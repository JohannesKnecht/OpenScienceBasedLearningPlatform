"""FastAPI application for the Open Science Based Learning Platform."""

import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://f618ad7356200906-frontend-service-y55vgiciiq-uc.a.run.app",
]

app.add_middleware(
    CORSMiddleware,  # type: ignore[invalid-argument-type]
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_DEFAULT_CURRICULUM_PATH = Path(__file__).parent / "curriculum.json"
CURRICULUM_PATH = Path(os.environ.get("CURRICULUM_PATH", _DEFAULT_CURRICULUM_PATH))


@app.get("/curriculum")
async def get_curriculum() -> Any:
    """Return the curriculum JSON document.

    Returns:
        The parsed curriculum as a JSON-serialisable object.

    Raises:
        HTTPException: 404 if the curriculum file cannot be found.
    """
    if not CURRICULUM_PATH.exists():
        raise HTTPException(status_code=404, detail="curriculum not found")
    with CURRICULUM_PATH.open() as f:
        return json.load(f)
