from __future__ import annotations

from uuid import uuid4

from models import Song, SongBook, SongBookCreateRequest, SongCreateRequest


class MockDataAdapter:
    def __init__(self) -> None:
        self._song_books: list[SongBook] = [
            SongBook(id="book-1", name="Thánh ca Mùa Vọng"),
            SongBook(id="book-2", name="Thánh ca Phục Sinh"),
        ]
        self._songs: list[Song] = [
            Song(
                id="song-1",
                title="Xin Vâng",
                firstLine="Xin vâng theo ý Chúa",
                author="Lm. Kim Long",
                songBookId="book-1",
                songBookNameSnapshot="Thánh ca Mùa Vọng",
                linkPdf="https://example.com/xin-vang.pdf",
            ),
            Song(
                id="song-2",
                title="Đêm Thánh Vô Cùng",
                firstLine="Đêm thánh vô cùng giây phút tưng bừng",
                author="Franz Xaver Gruber",
                songBookId="book-1",
                songBookNameSnapshot="Thánh ca Mùa Vọng",
            ),
            Song(
                id="song-3",
                title="Alleluia Mừng Chúa Sống Lại",
                firstLine="Alleluia, Alleluia!",
                author="Phanxicô",
                songBookId="book-2",
                songBookNameSnapshot="Thánh ca Phục Sinh",
            ),
            Song(
                id="song-4",
                title="Tình Chúa Cao Vời",
                firstLine="Tình Chúa cao vời khôn ví",
                author="Linh mục Tiến Linh",
                songBookId="book-2",
                songBookNameSnapshot="Thánh ca Phục Sinh",
            ),
            Song(
                id="song-5",
                title="Con Vẫn Trông Cậy",
                firstLine="Con vẫn trông cậy nơi Chúa",
                author="Nhạc sĩ Minh Tâm",
                songBookId="book-1",
                songBookNameSnapshot="Thánh ca Mùa Vọng",
            ),
        ]

    def list_song_books(self) -> list[SongBook]:
        return list(self._song_books)

    def create_song_book(self, payload: SongBookCreateRequest) -> SongBook:
        created = SongBook(id=f"book-{uuid4().hex[:8]}", name=payload.name)
        self._song_books.insert(0, created)
        return created

    def list_songs(self) -> list[Song]:
        return list(self._songs)

    def create_song(self, payload: SongCreateRequest) -> Song:
        selected_song_book = next(
            (song_book for song_book in self._song_books if song_book.id == payload.songBookId),
            None,
        )
        if selected_song_book is None:
            raise ValueError("Không tìm thấy tập sách đã chọn.")

        created_song = Song(
            id=f"song-{uuid4().hex[:8]}",
            title=payload.title,
            firstLine=payload.firstLine or "",
            author=payload.author,
            songBookId=selected_song_book.id,
            songBookNameSnapshot=selected_song_book.name,
            linkPdf=payload.linkPdf,
        )
        self._songs.insert(0, created_song)
        return created_song
