# Gia Phuoc Choir - Demo MVP

MVP demo nội bộ cho quản lý/tra cứu bài hát với các luồng chính:

- Đăng nhập demo.
- Tra cứu bài hát theo tên hoặc câu đầu (có dấu/không dấu).
- Thêm bài hát mới với đúng 6 trường.
- Xem danh sách bài hát.
- Thêm tập sách và xem bài hát theo từng tập.

## Stack và cấu trúc

- `frontend/`: React + Vite + React Router + Ant Design.
- `backend/`: Python + FastAPI.
- Data source: **NocoDB Cloud (bắt buộc, không có mock adapter)**.

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

Nếu thiếu cấu hình NocoDB, `/api/health` sẽ trả `status: degraded`, các API dữ liệu trả lỗi `503`.

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

### Schema chuẩn

`SongBook`:

```json
{
  "songBookId": "book-vong-01",
  "name": "Thánh ca Mùa Vọng"
}
```

`Song`:

```json
{
  "title": "Xin Vâng",
  "firstLine": "Xin vâng theo ý Chúa",
  "author": "Lm. Kim Long",
  "songBookId": "book-vong-01",
  "pageNumber": 12,
  "linkPdf": "https://..."
}
```

## Cấu hình NocoDB

Sửa `backend/.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
NOCODB_BASE_URL=https://app.nocodb.com
NOCODB_API_TOKEN=your_token
NOCODB_SONGS_TABLE_ID=<songs_table_id>
NOCODB_SONG_BOOKS_TABLE_ID=<song_books_table_id>
```

Hoặc dùng endpoint trực tiếp:

```env
NOCODB_SONGS_ENDPOINT=/api/v2/tables/<songs_table_id>/records
NOCODB_SONG_BOOKS_ENDPOINT=/api/v2/tables/<song_books_table_id>/records
```

Lưu ý:

- Không đặt NocoDB token ở frontend.
- Backend chỉ chạy với NocoDB Cloud.

## Lệnh QA nhanh

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend smoke test:

```bash
cd backend
python - <<'PY'
from fastapi.testclient import TestClient
from app import app
client = TestClient(app)
print(client.get('/api/health').json())
PY
```

## Deploy Vercel (2 project, cùng repo)

1. Backend project:
   - Root Directory: `backend/`
   - Entrypoint: `app.py` với `app = FastAPI()`
   - Env vars: `NOCODB_*`
2. Frontend project:
   - Root Directory: `frontend/`
   - Build: `npm run build`
   - Output: `dist`
   - Env var: `VITE_API_BASE_URL=<backend_vercel_url>`
