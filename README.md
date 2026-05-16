# Gia Phuoc Choir - Demo MVP

MVP demo nội bộ cho quản lý/tra cứu bài hát với các luồng chính:

- Đăng nhập demo.
- Tra cứu bài hát theo tên hoặc câu đầu (có dấu/không dấu).
- Thêm bài hát mới với đúng 6 trường (có số trang).
- Xem danh sách bài hát.
- Thêm tập sách và xem bài hát theo từng tập (điều hướng qua trang Bài hát với filter).

## Stack và cấu trúc

- `frontend/`: React + Vite + React Router + Ant Design.
- `backend/`: Python + FastAPI.
- Data adapter:
  - `mock` (mặc định): chạy local nhanh, dữ liệu reset khi restart backend.
  - `nocodb`: dùng khi đã có NocoDB Cloud credentials.

```text
DemoGiaPhuocChoir/
  frontend/
  backend/
  DEMO_MVP_TASKLIST.md
```

## 1) Chạy backend local

```bash
cd backend
python -m pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

API health check:

```bash
GET http://127.0.0.1:8000/api/health
```

## 2) Chạy frontend local

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend mặc định chạy ở:

- `http://127.0.0.1:5173`

## Demo account

- Username: `demo`
- Password: `demo123`

## Route chính

- `/login`: đăng nhập demo.
- `/`: Tra cứu & thêm bài hát.
- `/songs`: Danh sách bài hát (chỉ xem).
- `/song-books`: Thêm tập sách + xem bài trong tập.

## API hiện có

- `GET /api/health`
- `GET /api/song-books`
- `POST /api/song-books`
- `GET /api/songs`
- `POST /api/songs`

`POST /api/songs` nhận đúng 6 field:

```json
{
  "title": "Tên bài hát",
  "firstLine": "Câu đầu",
  "author": "Tác giả",
  "songBookId": "book-1",
  "pageNumber": 12,
  "linkPdf": "https://..."
}
```

`songBookNameSnapshot` hiện được giữ như field legacy để tương thích dữ liệu cũ. UI hiển thị tên tập theo bảng `SongBooks` hiện tại, nên nếu đổi tên tập thì bài hát cũ sẽ hiển thị theo tên mới.

## Chuyển sang NocoDB adapter

Sửa `backend/.env`:

```env
DATA_ADAPTER=nocodb
NOCODB_BASE_URL=https://app.nocodb.com
NOCODB_API_TOKEN=your_token
NOCODB_SONGS_ENDPOINT=/api/v2/tables/<songs_table_id>/records
NOCODB_SONG_BOOKS_ENDPOINT=/api/v2/tables/<song_books_table_id>/records
```

Hoặc dùng table id thay cho endpoint:

```env
NOCODB_SONGS_TABLE_ID=<songs_table_id>
NOCODB_SONG_BOOKS_TABLE_ID=<song_books_table_id>
```

Lưu ý:

- Không đặt NocoDB token ở frontend.
- MVP local mặc định dùng `mock` để chạy nhanh.

## Lệnh QA nhanh

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend (smoke test nhanh bằng script):

```bash
cd backend
python - <<'PY'
from fastapi.testclient import TestClient
from app import app
client = TestClient(app)
print(client.get("/api/health").json())
PY
```

## Deploy Vercel (2 project, cùng repo)

1. Backend project:
   - Root Directory: `backend/`
   - Entrypoint: `app.py` với `app = FastAPI()`
   - Env vars: `DATA_ADAPTER`, `NOCODB_*`
2. Frontend project:
   - Root Directory: `frontend/`
   - Build: `npm run build`
   - Output: `dist`
   - Env var: `VITE_API_BASE_URL=<backend_vercel_url>`
