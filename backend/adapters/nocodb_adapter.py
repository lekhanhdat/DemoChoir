from __future__ import annotations

from typing import Any

import httpx

from config import Settings
from models import Song, SongBook, SongBookCreateRequest, SongCreateRequest


class NocoDBDataAdapter:
    def __init__(
        self,
        *,
        base_url: str,
        api_token: str,
        songs_endpoint: str,
        song_books_endpoint: str,
    ) -> None:
        self._songs_endpoint = songs_endpoint
        self._song_books_endpoint = song_books_endpoint
        self._client = httpx.Client(
            base_url=base_url.rstrip("/"),
            timeout=20,
            headers={"xc-token": api_token},
        )

    @classmethod
    def from_settings(cls, settings: Settings) -> "NocoDBDataAdapter":
        base_url = settings.nocodb_base_url
        api_token = settings.nocodb_api_token
        songs_endpoint = settings.nocodb_songs_endpoint
        song_books_endpoint = settings.nocodb_song_books_endpoint

        if not songs_endpoint and settings.nocodb_songs_table_id:
            songs_endpoint = f"/api/v2/tables/{settings.nocodb_songs_table_id}/records"
        if not song_books_endpoint and settings.nocodb_song_books_table_id:
            song_books_endpoint = f"/api/v2/tables/{settings.nocodb_song_books_table_id}/records"

        if not base_url or not api_token or not songs_endpoint or not song_books_endpoint:
            raise RuntimeError(
                "Thiếu cấu hình NocoDB. Hãy set NOCODB_BASE_URL, NOCODB_API_TOKEN và endpoint/table id."
            )

        return cls(
            base_url=base_url,
            api_token=api_token,
            songs_endpoint=songs_endpoint,
            song_books_endpoint=song_books_endpoint,
        )

    def list_song_books(self) -> list[SongBook]:
        payload = self._request_json("GET", self._song_books_endpoint)
        records = self._extract_records(payload)
        return [self._to_song_book(record) for record in records]

    def create_song_book(self, payload: SongBookCreateRequest) -> SongBook:
        response = self._request_json("POST", self._song_books_endpoint, {"name": payload.name})
        record = self._extract_single_record(response)
        return self._to_song_book(record)

    def list_songs(self) -> list[Song]:
        payload = self._request_json("GET", self._songs_endpoint)
        records = self._extract_records(payload)
        return [self._to_song(record) for record in records]

    def create_song(self, payload: SongCreateRequest) -> Song:
        selected_song_book = next(
            (song_book for song_book in self.list_song_books() if song_book.id == payload.songBookId),
            None,
        )
        if selected_song_book is None:
            raise ValueError("Không tìm thấy tập sách đã chọn.")

        post_body = {
            "title": payload.title,
            "firstLine": payload.firstLine or "",
            "author": payload.author,
            "songBookId": payload.songBookId,
            "songBookNameSnapshot": selected_song_book.name,
            "linkPdf": payload.linkPdf,
        }

        response = self._request_json("POST", self._songs_endpoint, post_body)
        record = self._extract_single_record(response)
        return self._to_song(record)

    def _request_json(self, method: str, endpoint: str, body: dict[str, Any] | None = None) -> Any:
        response = self._client.request(method, endpoint, json=body)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise RuntimeError(
                f"NocoDB trả lỗi ({exc.response.status_code}): {exc.response.text}"
            ) from exc

        try:
            return response.json()
        except ValueError as exc:
            raise RuntimeError("NocoDB trả dữ liệu không hợp lệ.") from exc

    def _extract_records(self, payload: Any) -> list[dict[str, Any]]:
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict):
            for key in ("list", "records", "data"):
                value = payload.get(key)
                if isinstance(value, list):
                    return value
        raise RuntimeError("Không đọc được danh sách records từ NocoDB.")

    def _extract_single_record(self, payload: Any) -> dict[str, Any]:
        if isinstance(payload, dict):
            for key in ("record", "data"):
                value = payload.get(key)
                if isinstance(value, dict):
                    return value

        records = self._extract_records(payload)
        if not records:
            raise RuntimeError("NocoDB không trả record sau khi tạo dữ liệu.")
        return records[0]

    @staticmethod
    def _to_song_book(record: dict[str, Any]) -> SongBook:
        song_book_id = record.get("id") or record.get("Id") or record.get("ncRecordId")
        name = record.get("name") or record.get("Name")
        if not song_book_id or not name:
            raise RuntimeError("Dữ liệu SongBook từ NocoDB thiếu id hoặc name.")
        return SongBook(id=str(song_book_id), name=str(name))

    @staticmethod
    def _to_song(record: dict[str, Any]) -> Song:
        song_id = record.get("id") or record.get("Id") or record.get("ncRecordId")
        title = record.get("title") or record.get("Title")
        author = record.get("author") or record.get("Author")
        song_book_id = record.get("songBookId") or record.get("bookId") or record.get("song_book_id")
        song_book_name = (
            record.get("songBookNameSnapshot")
            or record.get("bookNameSnapshot")
            or record.get("songBookName")
        )

        if not song_id or not title or not author or not song_book_id:
            raise RuntimeError("Dữ liệu Song từ NocoDB thiếu field bắt buộc.")

        return Song(
            id=str(song_id),
            title=str(title),
            firstLine=str(record.get("firstLine") or record.get("FirstLine") or ""),
            author=str(author),
            songBookId=str(song_book_id),
            songBookNameSnapshot=str(song_book_name or ""),
            linkPdf=record.get("linkPdf") or record.get("pdfLink"),
        )
