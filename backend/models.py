from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SongBook(BaseModel):
    id: str
    name: str


class Song(BaseModel):
    id: str
    title: str
    firstLine: str = ""
    author: str
    songBookId: str
    songBookNameSnapshot: str
    linkPdf: str | None = None


class SongBookCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=200)

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Tên tập sách không được để trống.")
        return normalized


class SongCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=1, max_length=250)
    firstLine: str | None = Field(default=None, max_length=500)
    author: str = Field(min_length=1, max_length=200)
    songBookId: str = Field(min_length=1, max_length=100)
    linkPdf: str | None = Field(default=None, max_length=1000)

    @field_validator("title", "author", "songBookId")
    @classmethod
    def normalize_required_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Trường bắt buộc không được để trống.")
        return normalized

    @field_validator("firstLine", "linkPdf")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        return normalized or None
