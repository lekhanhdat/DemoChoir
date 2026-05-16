from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass
class Settings:
    cors_allowed_origins: list[str]
    nocodb_base_url: str | None
    nocodb_api_token: str | None
    nocodb_songs_endpoint: str | None
    nocodb_song_books_endpoint: str | None
    nocodb_songs_table_id: str | None
    nocodb_song_books_table_id: str | None


def _env(key: str) -> str | None:
    value = os.getenv(key)
    if value is None:
        return None
    value = value.strip()
    return value if value else None


def load_settings() -> Settings:
    load_dotenv()

    raw_origins = _env("CORS_ALLOWED_ORIGINS") or "http://localhost:5173,http://127.0.0.1:5173"
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    return Settings(
        cors_allowed_origins=origins,
        nocodb_base_url=_env("NOCODB_BASE_URL"),
        nocodb_api_token=_env("NOCODB_API_TOKEN"),
        nocodb_songs_endpoint=_env("NOCODB_SONGS_ENDPOINT"),
        nocodb_song_books_endpoint=_env("NOCODB_SONG_BOOKS_ENDPOINT"),
        nocodb_songs_table_id=_env("NOCODB_SONGS_TABLE_ID"),
        nocodb_song_books_table_id=_env("NOCODB_SONG_BOOKS_TABLE_ID"),
    )
