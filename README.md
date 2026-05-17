# Gia Phuoc Choir - Demo MVP

## Giới thiệu

Đây là demo MVP cho bài toán quản lý và tra cứu bài hát nội bộ của ca đoàn Gia Phước.  
Mục tiêu của dự án là giúp người dùng có thể tìm bài nhanh, thêm bài mới, quản lý tập sách và xem bài theo từng tập một cách đơn giản.

## Dự án đang làm được gì

- Đăng nhập bằng tài khoản nội bộ.
- Tra cứu bài hát theo tên hoặc câu đầu (hỗ trợ có dấu/không dấu).
- Thêm bài hát mới.
- Xem danh sách bài hát.
- Thêm tập sách mới.
- Bấm vào tập sách để xem các bài thuộc tập đó.

## Luồng demo gợi ý (3-5 phút)

1. Đăng nhập bằng tài khoản nội bộ được cấp.
2. Vào màn hình `Tra cứu & thêm`, thử tìm một bài hát.
3. Thêm một tập sách mới ở màn hình `Tập sách`.
4. Quay lại màn hình `Tra cứu & thêm` để thêm một bài mới vào tập vừa tạo.
5. Vào màn hình `Bài hát` để lọc và kiểm tra lại dữ liệu.

## Tài khoản đăng nhập

- Tài khoản được quản trị viên cấp riêng cho người dùng nội bộ.
- Không công khai username/password trong tài liệu dự án.

## Cấu trúc chính của repo

```text
frontend/  -> giao diện người dùng
backend/   -> API trung gian đọc/ghi dữ liệu
```

## Chạy nhanh dự án (local)

### 1) Chạy backend

```bash
cd backend
python -m pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

### 2) Chạy frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Mở trình duyệt tại: `http://127.0.0.1:5173`

## Ghi chú dữ liệu

- Demo dùng dữ liệu thật từ NocoDB (không dùng mock data).
- Nếu app mở được nhưng không thấy dữ liệu, thường là do thiếu cấu hình `.env` hoặc token/kết nối dữ liệu chưa đúng.

## Ghi chú cho quản trị viên

- Nếu cần thêm tài khoản đăng nhập hardcode, sửa danh sách `LOCAL_ACCOUNTS` trong file:
  - `frontend/src/utils/auth.ts`

## Trạng thái hiện tại

- Core flow local đã chạy được.
- Backend production đã trả dữ liệu thật.
- Còn vài hạng mục kiểm tra cuối trước khi chốt bản demo hoàn chỉnh.
