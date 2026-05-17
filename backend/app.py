from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from adapters import create_data_adapter
from adapters.base import DataAdapter
from config import load_settings
from models import Song, SongBook, SongBookCreateRequest, SongCreateRequest

settings = load_settings()
adapter: DataAdapter | None = None
adapter_error: str | None = None

try:
    adapter = create_data_adapter(settings)
except RuntimeError as exc:
    adapter_error = str(exc)

app = FastAPI(title="Gia Phuoc Choir API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_adapter() -> DataAdapter:
    if adapter is None:
        detail = adapter_error or "Thiếu cấu hình NocoDB."
        raise HTTPException(status_code=503, detail=detail)
    return adapter


@app.get("/")
def root() -> dict[str, str]:
    return {
        "name": "Gia Phuoc Choir API",
        "health": "/api/health",
    }


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok" if adapter is not None else "degraded",
        "adapter": "nocodb",
        "dataReady": "true" if adapter is not None else "false",
    }


@app.get("/api/song-books", response_model=list[SongBook])
def get_song_books() -> list[SongBook]:
    active_adapter = _get_adapter()
    try:
        return active_adapter.list_song_books()
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/song-books", response_model=SongBook)
def create_song_book(payload: SongBookCreateRequest) -> SongBook:
    active_adapter = _get_adapter()
    try:
        return active_adapter.create_song_book(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.get("/api/songs", response_model=list[Song])
def get_songs() -> list[Song]:
    active_adapter = _get_adapter()
    try:
        return active_adapter.list_songs()
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@app.post("/api/songs", response_model=Song)
def create_song(payload: SongCreateRequest) -> Song:
    active_adapter = _get_adapter()
    try:
        return active_adapter.create_song(payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
