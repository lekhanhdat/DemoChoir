from __future__ import annotations

import re
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
        base_url = _normalize_nocodb_base_url(settings.nocodb_base_url)
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
        song_books: list[SongBook] = []
        invalid_records = 0
        for record in records:
            try:
                song_books.append(self._to_song_book(record))
            except RuntimeError:
                invalid_records += 1

        if not song_books and invalid_records > 0:
            raise RuntimeError(
                "Dữ liệu bảng SongBooks không hợp lệ. Cần đủ 2 field songBookId và name."
            )

        return song_books

    def create_song_book(self, payload: SongBookCreateRequest) -> SongBook:
        response = self._request_json(
            "POST",
            self._song_books_endpoint,
            {"songBookId": payload.songBookId, "name": payload.name},
        )
        try:
            record = self._extract_single_record(response)
            return self._to_song_book(record)
        except RuntimeError as exc:
            raise RuntimeError(
                "Không thể map SongBook theo schema mới. Hãy kiểm tra bảng SongBooks có field songBookId và name."
            ) from exc

    def list_songs(self) -> list[Song]:
        payload = self._request_json("GET", self._songs_endpoint)
        records = self._extract_records(payload)
        valid_song_book_ids = {song_book.songBookId for song_book in self.list_song_books()}
        songs: list[Song] = []
        for record in records:
            try:
                song = self._to_song(record)
            except RuntimeError:
                continue
            if song.songBookId in valid_song_book_ids:
                songs.append(song)
        return songs

    def create_song(self, payload: SongCreateRequest) -> Song:
        normalized_song_book_id = payload.songBookId.strip()
        song_book_exists = any(
            song_book.songBookId == normalized_song_book_id for song_book in self.list_song_books()
        )
        if not song_book_exists:
            raise ValueError("Không tìm thấy tập sách đã chọn.")

        base_post_body = {
            "title": payload.title,
            "firstLine": payload.firstLine or "",
            "author": payload.author,
            "songBookId": normalized_song_book_id,
            "linkPdf": payload.linkPdf,
        }

        last_error: RuntimeError | None = None
        for page_field_name in ("pageNumber", "soTrang", "page"):
            try:
                response = self._request_json(
                    "POST",
                    self._songs_endpoint,
                    {**base_post_body, page_field_name: payload.pageNumber},
                )
                record = self._extract_single_record(response)
                return self._to_song(record)
            except RuntimeError as exc:
                message = str(exc).lower()
                if "unknown" not in message and "column" not in message:
                    raise
                last_error = exc

        if last_error is not None:
            raise last_error
        raise RuntimeError("Không thể tạo bài hát trong NocoDB.")

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
            if payload:
                return payload

        records = self._extract_records(payload)
        if not records:
            raise RuntimeError("NocoDB không trả record sau khi tạo dữ liệu.")
        return records[0]

    @staticmethod
    def _to_song_book(record: dict[str, Any]) -> SongBook:
        song_book_id = _coerce_song_book_id(
            record.get("songBookId")
            or record.get("SongBookId")
            or record.get("song_book_id")
            or record.get("maTapSach")
            or record.get("songBook")
            or record.get("SongBook")
        )
        name = _coerce_optional_string(record.get("name") or record.get("Name"))

        if not song_book_id or not name:
            raise RuntimeError("Dữ liệu SongBook từ NocoDB thiếu songBookId hoặc name.")

        return SongBook(songBookId=song_book_id, name=name)

    @staticmethod
    def _to_song(record: dict[str, Any]) -> Song:
        title = record.get("title") or record.get("Title")
        author = record.get("author") or record.get("Author")
        song_book_id = _coerce_song_book_id(
            record.get("songBookId")
            or record.get("SongBookId")
            or record.get("bookId")
            or record.get("song_book_id")
            or record.get("songBook")
            or record.get("SongBook")
        )
        page_number = _coerce_page_number(
            record.get("pageNumber")
            or record.get("PageNumber")
            or record.get("page")
            or record.get("Page")
            or record.get("soTrang")
            or record.get("SoTrang")
        )

        if not title or not author or not song_book_id or page_number is None:
            raise RuntimeError("Dữ liệu Song từ NocoDB thiếu field bắt buộc.")

        return Song(
            title=str(title),
            firstLine=str(record.get("firstLine") or record.get("FirstLine") or ""),
            author=str(author),
            songBookId=song_book_id,
            pageNumber=page_number,
            linkPdf=_coerce_optional_string(record.get("linkPdf") or record.get("pdfLink")),
        )


def _coerce_page_number(value: Any) -> int | None:
    if value is None:
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _coerce_optional_string(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _coerce_song_book_id(value: Any) -> str | None:
    if value is None:
        return None

    if isinstance(value, list):
        for item in value:
            extracted = _coerce_song_book_id(item)
            if extracted is not None:
                return extracted
        return None

    if isinstance(value, dict):
        for key in ("songBookId", "SongBookId", "id", "Id"):
            extracted = _coerce_song_book_id(value.get(key))
            if extracted is not None:
                return extracted
        return None

    text = str(value).strip()
    return text or None


def _normalize_nocodb_base_url(raw_base_url: str | None) -> str | None:
    if not raw_base_url:
        return None

    base_url = raw_base_url.strip()
    if base_url.startswith("http://") or base_url.startswith("https://"):
        return base_url

    if "." in base_url:
        return f"https://{base_url}"

    # If caller passes a base id/slug instead of full host, fall back to NocoDB Cloud host.
    if re.fullmatch(r"[a-zA-Z0-9_-]{8,}", base_url):
        return "https://app.nocodb.com"

    return f"https://{base_url}"
