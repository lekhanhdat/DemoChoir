from __future__ import annotations

from typing import Protocol

from models import Song, SongBook, SongBookCreateRequest, SongCreateRequest


class DataAdapter(Protocol):
    def list_song_books(self) -> list[SongBook]:
        ...

    def create_song_book(self, payload: SongBookCreateRequest) -> SongBook:
        ...

    def list_songs(self) -> list[Song]:
        ...

    def create_song(self, payload: SongCreateRequest) -> Song:
        ...
