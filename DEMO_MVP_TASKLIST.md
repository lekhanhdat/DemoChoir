# Demo MVP Tasklist - Gia Phuoc Choir

Mục tiêu: dựng nhanh một demo MVP cho repo mới, đủ để người dùng thấy được các giá trị chính: đăng nhập demo, tra cứu bài hát, thêm bài hát, xem danh sách bài hát, quản lý tập sách và xem bài hát theo từng tập sách.

## Định hướng kỹ thuật

- Frontend: ReactJS, ưu tiên Vite để khởi tạo nhanh.
- Routing: React Router.
- UI/CSS: chọn Ant Design làm UI library chính để đồng bộ form, table, layout, drawer, alert và validation.
- Thiết kế giao diện: sử dụng skill `ui-ux-pro-max` để định hướng design system trước khi triển khai UI.
- Backend: Python + FastAPI.
- Data source cuối cùng: NocoDB Cloud.
- Dùng 100% dữ liệu từ NocoDB Cloud cho toàn bộ luồng demo (không dùng mock/in-memory).
- Auth demo: hardcode account ở frontend hoặc backend, chưa cần bảng user thật.
- Repo này là repo mới, vì vậy không phụ thuộc mock data, schema cũ, Supabase hay migration cũ; dữ liệu lấy trực tiếp từ NocoDB Cloud.
- Cấu trúc deploy: giữ frontend và backend trong cùng một repo, tách thành 2 folder `frontend/` và `backend/`.

## Nguyên tắc cắt scope

- Không dùng Supabase trong demo.
- Không làm upload file; trường `linkPdf` chỉ là một URL text.
- Không làm OCR, activity log, soft delete/archive, phân quyền nâng cao, audit, restore, import/export.
- Không làm sửa/xóa trong demo trừ khi còn thời gian sau khi luồng chính chạy ổn.
- Không thêm metadata nâng cao như mùa phụng vụ, chủ đề, vị trí hát, số thứ tự (ngoại lệ: giữ trường số trang theo yêu cầu hiện tại).
- Ưu tiên UI ít trang, ít thao tác, dễ demo trên màn hình lớn.
- Ưu tiên hoàn thành end-to-end local theo luồng thật: React UI -> FastAPI -> NocoDB Cloud.
- FastAPI kết nối NocoDB Cloud ngay từ đầu, không có bước chuyển đổi adapter.
- Không trộn nhiều UI/CSS library trong MVP; dùng Ant Design là chính, CSS custom chỉ để chỉnh layout nhỏ.

## Thiết kế giao diện

- [ ] Chạy `ui-ux-pro-max` để lấy design system cho app quản lý/tra cứu bài hát nội bộ.
- [ ] Dùng Ant Design làm nguồn component chính.
  - [ ] `Layout`, `Menu`, `Typography` cho app shell.
  - [ ] `Form`, `Input`, `Select`, `Button` cho login và form nhập liệu.
  - [ ] `Table`, `List`, `Tag`, `Empty` cho danh sách.
  - [ ] `Drawer` hoặc `Sider` cho panel xem bài hát trong tập sách.
  - [ ] `Alert`, `Spin`, `Message` cho lỗi, loading và phản hồi thao tác.
- [ ] Dùng `@ant-design/icons` cho icon, không dùng emoji làm icon UI.
- [ ] Theme đề xuất:
  - [ ] Font chính: `Inter`.
  - [ ] Nền: trắng/xám rất nhạt.
  - [ ] Text chính: xám đậm.
  - [ ] Màu nhấn: vàng nhẹ hoặc màu primary đã cấu hình trong Ant Design, dùng tiết chế.
- [ ] UI nên theo hướng dashboard nội bộ: gọn, dễ scan, ưu tiên bảng/form rõ ràng hơn hiệu ứng trang trí.
- [ ] Kiểm tra accessibility cơ bản:
  - [ ] Input có label.
  - [ ] Button có trạng thái loading/disabled khi submit.
  - [ ] Focus state nhìn thấy được.
  - [ ] Không dùng màu sắc là tín hiệu duy nhất cho lỗi/trạng thái.

## Cấu trúc repo đề xuất

- [ ] Dùng mono-repo với 2 folder chính.
  - [ ] `frontend/` - ReactJS + Vite + Ant Design.
  - [ ] `backend/` - Python + FastAPI.
- [ ] Khởi tạo frontend ReactJS bằng Vite trong `frontend/`.
  - [ ] Cài các package tối thiểu: `react`, `react-dom`, `react-router-dom`, `antd`, `@ant-design/icons`.
  - [ ] Import Ant Design reset CSS ở entry app: `antd/dist/reset.css`.
  - [ ] Thêm script: `dev`, `build`, `lint` nếu dùng ESLint.
- [ ] Khởi tạo backend FastAPI trong `backend/`.
  - [ ] Tạo `app.py` hoặc `index.py` có biến `app = FastAPI()`.
  - [ ] Tạo `requirements.txt` hoặc `pyproject.toml`.
  - [ ] Cài package tối thiểu: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`.
- [ ] Tạo file cấu hình môi trường mẫu:
  - [ ] `.env.example` cho frontend nếu cần `VITE_API_BASE_URL`.
  - [ ] `.env.example` cho backend nếu cần `NOCODB_BASE_URL`, `NOCODB_API_TOKEN`, `NOCODB_PROJECT_ID` hoặc `NOCODB_TABLE_ID`.
- [ ] Cập nhật `README.md` sau khi có lệnh chạy thực tế.

## Deploy Vercel

- [ ] Giữ FE và BE trong cùng một repo không ảnh hưởng đến deploy Vercel nếu cấu hình Root Directory đúng.
- [ ] Tạo 2 Vercel Projects từ cùng Git repo:
  - [ ] Project frontend: Root Directory là `frontend/`.
  - [ ] Project backend: Root Directory là `backend/`.
- [ ] Frontend deploy bằng Vercel Vite preset.
  - [ ] Build command: `npm run build`.
  - [ ] Output directory: `dist`.
  - [ ] Environment variable: `VITE_API_BASE_URL` trỏ tới URL backend Vercel.
- [ ] Backend deploy bằng Vercel Python/FastAPI runtime.
  - [ ] Đảm bảo `backend/app.py` hoặc `backend/index.py` export biến `app = FastAPI()`.
  - [ ] Đảm bảo dependencies nằm trong `backend/requirements.txt` hoặc `backend/pyproject.toml`.
  - [ ] Environment variables cho NocoDB chỉ đặt ở Vercel Project backend, không đặt ở frontend.
- [ ] Lưu ý giới hạn serverless:
  - [ ] Không dựa vào in-memory data cho production vì Vercel Function không đảm bảo state lâu dài.
  - [ ] Sau khi deploy thật, dữ liệu cần đi qua NocoDB Cloud.
  - [ ] Backend nên là API stateless, mỗi request đọc/ghi qua NocoDB.

## Setup NocoDB Cloud

- [x] Tạo workspace/base trong NocoDB cho demo Gia Phuoc Choir.
- [x] Tạo bảng `SongBooks`.
  - [x] Không dùng trường `id` trong logic nghiệp vụ/app (NocoDB có thể tự sinh nội bộ).
  - [x] `songBookId` - khóa nghiệp vụ của tập sách, bắt buộc, unique.
  - [x] `name` - tên tập sách, bắt buộc.
  - [x] `createdAt` - ngày tạo, có thể dùng field hệ thống của NocoDB.
- [x] Tạo bảng `Songs`.
  - [x] Không dùng trường `id` trong logic nghiệp vụ/app (NocoDB có thể tự sinh nội bộ).
  - [x] `title` - tên bài hát, bắt buộc.
  - [x] `firstLine` - câu đầu, không bắt buộc.
  - [x] `author` - tác giả, bắt buộc.
  - [x] `songBookId` - bắt buộc, join với `SongBooks.songBookId`.
  - [x] `pageNumber` - số trang, kiểu number, bắt buộc; dùng làm khóa nghiệp vụ của bài hát (khuyến nghị unique theo cặp `songBookId` + `pageNumber`).
  - [x] `linkPdf` - URL PDF, không bắt buộc.
  - [x] `createdAt` - ngày tạo, có thể dùng field hệ thống của NocoDB.
- [x] Seed dữ liệu demo ban đầu.
  - [x] Tạo ít nhất 2 tập sách mẫu.
  - [x] Tạo ít nhất 5 bài hát mẫu.
  - [x] Có ít nhất 1 bài có `linkPdf`.
  - [x] Có dữ liệu tiếng Việt có dấu để test search.
- [x] Lấy thông tin kết nối NocoDB.
  - [x] Base URL.
  - [x] API token.
  - [x] Table ID cho `Songs`.
  - [x] Table ID cho `SongBooks`.

## Backend Python + FastAPI

- [x] Dùng backend mỏng để gọi NocoDB, tránh để lộ API token ở frontend.
- [x] Backend chỉ làm các API tối thiểu:
  - [x] `GET /api/song-books`
  - [x] `POST /api/song-books`
  - [x] `GET /api/songs`
  - [x] `POST /api/songs`
- [x] Frontend chỉ gọi backend qua `VITE_API_BASE_URL`.
- [x] Tạo app FastAPI tối giản.
- [x] Cài package cần thiết: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`.
- [x] Tạo CORS config cho local frontend và domain frontend Vercel.
- [x] Tạo data access layer cho NocoDB bằng `httpx`.
  - [x] Chuẩn hóa request/response cho `SongBooks` và `Songs`.
  - [ ] Mapping rõ quan hệ `Songs.songBookId` -> `SongBooks.songBookId`.
- [ ] Backend chỉ chạy với NocoDB Cloud, không thêm adapter mock.
- [x] Đọc NocoDB config từ `.env`.
- [x] Thêm validation đơn giản trước khi ghi dữ liệu.

## Account demo

- [ ] Tạo trang `/login`.
- [ ] Hardcode account demo:
  - Username: `demo`
  - Password: `demo123`
- [ ] Khi login đúng, lưu trạng thái đơn giản ở client bằng `localStorage`.
- [ ] Khi chưa login, redirect các trang chính về `/login`.
- [ ] Header hiển thị user cố định: `Ca trưởng (demo)`.
- [ ] Có nút đăng xuất, xóa trạng thái login và quay về `/login`.
- [ ] Không cần đăng ký tài khoản, đổi mật khẩu, quên mật khẩu hoặc phân quyền.

## Layout và navigation

- [ ] Tạo app shell sau khi login.
  - [ ] Dùng Ant Design `Layout`.
  - [ ] Header có tên app: `Gia Phuoc Choir`.
  - [ ] Header có tên user demo và nút đăng xuất.
  - [ ] Sidebar hoặc top navigation có 3 mục chính bằng Ant Design `Menu`.
- [ ] Navigation chỉ giữ:
  - [ ] `Tra cứu & thêm` -> route `/`
  - [ ] `Bài hát` -> route `/songs`
  - [ ] `Tập sách` -> route `/song-books`
- [ ] Không tạo menu cho Nhật ký, OCR, Upload, Import/Export hoặc Cấu hình nâng cao.
- [ ] Copy UI viết bằng tiếng Việt đúng encoding UTF-8.
- [ ] Dùng Ant Design spacing/grid để giữ layout đồng bộ, không viết CSS thủ công quá nhiều.
- [ ] Trên mobile/tablet, form và bảng vẫn dùng được, chưa cần tối ưu sâu.

## Luồng 1 + 2: Tra cứu và thêm bài hát

Route đề xuất: `/`

- [ ] Tạo page chính sau login: `Tra cứu & thêm bài hát`.
- [ ] Khi page load, gọi FastAPI lấy danh sách bài hát và tập sách.
- [ ] Hiển thị ô search lớn ở đầu page.
- [ ] Search chỉ cần tìm theo:
  - [ ] Tên bài hát.
  - [ ] Câu đầu.
- [ ] Search hỗ trợ có dấu/không dấu bằng helper normalize phía frontend.
- [ ] Bên dưới search hiển thị kết quả tối giản:
  - [ ] Tên bài hát.
  - [ ] Câu đầu.
  - [ ] Tác giả.
  - [ ] Số trang.
  - [ ] Tập sách.
  - [ ] Link PDF nếu có.
- [ ] Thêm form `Thêm bài hát mới` trên cùng page.
- [ ] Dùng Ant Design `Form`, `Input`, `Select`, `Button` cho form thêm bài hát.
- [ ] Form thêm bài hát chỉ có 6 trường:
  - [ ] `Tên bài hát` - bắt buộc.
  - [ ] `Câu đầu` - không bắt buộc.
  - [ ] `Tác giả` - bắt buộc.
  - [ ] `Nằm trong sách nào` - bắt buộc, chọn từ danh sách tập sách.
  - [ ] `Số trang` - bắt buộc, number.
  - [ ] `Link PDF` - không bắt buộc.
- [ ] Khi submit form:
  - [ ] Validate các trường bắt buộc ở frontend.
  - [ ] Gửi request tạo bài hát tới FastAPI.
  - [ ] Lưu `songBookId` lấy từ `SongBooks.songBookId` (UI chỉ hiển thị `SongBooks.name`).
  - [ ] Sau khi tạo thành công, reset form.
  - [ ] Refresh danh sách hoặc append bài mới vào state hiện tại.
- [ ] Nếu thiếu trường bắt buộc, hiển thị lỗi ngắn ngay tại form.
- [ ] Nếu API lỗi, hiển thị thông báo lỗi dễ hiểu, không để app trắng màn hình.
- [ ] Dùng Ant Design `Alert` hoặc `message` cho lỗi API/thông báo tạo thành công.

## Luồng 3a: Xem danh sách bài hát

Route đề xuất: `/songs`

- [ ] Tạo page `/songs` dạng danh sách chỉ xem.
- [ ] Khi page load, gọi FastAPI lấy danh sách bài hát.
- [ ] Dùng Ant Design `Table` cho danh sách bài hát.
- [ ] Bảng chỉ cần các cột:
  - [ ] Tên bài hát.
  - [ ] Câu đầu.
  - [ ] Tác giả.
  - [ ] Số trang.
  - [ ] Tập sách.
  - [ ] Link PDF.
- [ ] Có ô tìm nhanh theo tên bài hát hoặc câu đầu.
- [ ] Có 2 filter ngay dưới ô tìm nhanh:
  - [ ] Filter theo tác giả.
  - [ ] Filter theo tập sách.
- [ ] Tái sử dụng helper search normalize từ page chính.
- [ ] Không hiển thị nút sửa, xóa mềm, trạng thái, activity log.
- [ ] Nếu chưa có bài hát, hiển thị Ant Design `Empty` với nội dung ngắn: `Chưa có bài hát nào`.

## Luồng 3b: Xem tập sách và bài hát trong tập

Route đề xuất: `/song-books`

- [ ] Tạo page `/song-books` quản lý tập sách tối giản.
- [ ] Khi page load, gọi FastAPI lấy danh sách tập sách và bài hát.
- [ ] Phần trên có form `Thêm tập sách mới`.
- [ ] Dùng Ant Design `Form`, `Input`, `Button` cho form thêm tập sách.
- [ ] Form thêm tập sách chỉ cần 1 trường:
  - [ ] `Tên tập sách` - bắt buộc.
  - [ ] `songBookId` tự sinh ở frontend để người dùng không phải nhập mã kỹ thuật.
- [ ] Khi submit form:
  - [ ] Validate tên tập sách và tự sinh `songBookId`.
  - [ ] Gửi request tạo tập sách tới FastAPI.
  - [ ] Reset form.
  - [ ] Refresh danh sách tập sách hoặc append tập mới vào state hiện tại.
- [ ] Bên dưới hiển thị danh sách tập sách.
- [ ] Mỗi dòng tập sách hiển thị:
  - [ ] Tên tập sách.
  - [ ] Số bài hát thuộc tập đó.
  - [ ] Nút `Xem bài` để lọc bài hát theo tập sách.
- [ ] Không hiển thị cột `Trang nhỏ nhất` và không sort theo tiêu chí này.
- [ ] Khi bấm `Xem bài` ở một tập sách, chuyển sang trang `/songs` và tự động filter theo tập sách đó.
- [ ] Tập sách mới phải xuất hiện trong dropdown chọn sách ở form thêm bài hát.
- [ ] Không cần sửa/xóa/archive tập sách trong demo.

## API và mapping dữ liệu

- [ ] Chuẩn hóa model phía frontend:
  - [ ] `Song`: `title`, `firstLine`, `author`, `songBookId`, `pageNumber`, `linkPdf` (không dùng `id` tự sinh; định danh theo `songBookId` + `pageNumber`).
  - [ ] `SongBook`: `songBookId`, `name`.
- [ ] Nếu dùng backend, chuẩn hóa response trước khi trả về frontend để frontend không phụ thuộc trực tiếp vào tên field nội bộ của NocoDB.
- [ ] API tạo bài hát chỉ nhận 6 field demo:
  - [ ] `title`
  - [ ] `firstLine`
  - [ ] `author`
  - [ ] `songBookId`
  - [ ] `pageNumber`
  - [ ] `linkPdf`
- [ ] UI hiển thị tên tập sách theo `SongBooks` hiện tại qua join `songBookId`.
- [ ] API tạo tập sách nhận 2 field: `songBookId`, `name`.
- [ ] Không dùng local mock data trong bất kỳ môi trường nào của demo.
- [ ] Nếu thiếu NocoDB credentials thì dừng tính năng dữ liệu và báo lỗi cấu hình rõ ràng.

## Step-by-step triển khai đề xuất

### Bước 1: Khởi tạo mono-repo FE/BE

- [x] Tạo folder `frontend/` cho React app.
- [x] Tạo React app bằng Vite trong `frontend/`.
- [x] Cài React Router.
- [x] Cài Ant Design và icon package: `antd`, `@ant-design/icons`.
- [x] Import `antd/dist/reset.css` trong entry app.
- [x] Tạo folder `backend/` cho FastAPI app.
- [x] Tạo `backend/app.py` hoặc `backend/index.py` với `app = FastAPI()`.
- [x] Tạo `backend/requirements.txt` hoặc `backend/pyproject.toml`.
- [x] Cài package backend: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`.

### Bước 2: Kết nối backend trực tiếp với NocoDB Cloud

- [x] Tạo endpoint health check: `GET /api/health`.
- [x] Tạo lớp gọi NocoDB (HTTP client + helper build endpoint).
- [x] Tạo API đọc danh sách tập sách: `GET /api/song-books`.
- [x] Tạo API tạo tập sách: `POST /api/song-books`.
- [x] Tạo API đọc danh sách bài hát: `GET /api/songs`.
- [x] Tạo API tạo bài hát: `POST /api/songs`.
- [x] Test từng endpoint bằng REST client với dữ liệu thật từ NocoDB.
- [x] Ghi chú rõ: demo chỉ dùng NocoDB Cloud, không có fallback mock.

### Bước 3: Làm app shell và login demo

- [x] Tạo các route rỗng: `/login`, `/`, `/songs`, `/song-books`.
- [x] Tạo app shell cơ bản cho các route sau login.
- [x] Tạo UI login bằng Ant Design `Form`, `Input.Password`, `Button`, `Alert`.
- [x] Validate username/password hardcode.
- [x] Lưu trạng thái login vào `localStorage`.
- [x] Tạo route guard cho các page chính.
- [x] Tạo logout trong header.

### Bước 4: Nối frontend với FastAPI

- [x] Tạo file service/API client phía frontend.
- [x] Cấu hình `VITE_API_BASE_URL`.
- [x] Implement hàm `getSongs`.
- [x] Implement hàm `createSong`.
- [x] Implement hàm `getSongBooks`.
- [x] Implement hàm `createSongBook`.
- [x] Thêm trạng thái loading/error cho từng page.
- [x] Chạy song song frontend và backend local để xác nhận FE gọi được BE.

### Bước 5: Làm page Tra cứu & thêm

- [x] Load bài hát và tập sách khi vào page.
- [x] Làm helper normalize tiếng Việt cho search không dấu.
- [x] Làm danh sách kết quả search bằng Ant Design `Table` hoặc `List`.
- [x] Làm form thêm bài hát 6 trường bằng Ant Design `Form`.
- [x] Validate form.
- [x] Gửi API tạo bài hát.
- [x] Refresh hoặc cập nhật state sau khi tạo thành công.

### Bước 6: Làm page Bài hát

- [x] Load danh sách bài hát.
- [x] Hiển thị bảng chỉ xem bằng Ant Design `Table`.
- [x] Thêm ô tìm nhanh.
- [x] Thêm filter theo tác giả và tập sách ngay dưới ô tìm.
- [x] Xử lý empty state và loading state.

### Bước 7: Làm page Tập sách

- [x] Load danh sách tập sách và bài hát.
- [x] Hiển thị form thêm tập sách bằng Ant Design `Form`.
- [x] Hiển thị số bài hát theo từng tập.
- [ ] Hiển thị tập sách tối giản (tên tập, số bài, nút `Xem bài`) không có cột `Trang nhỏ nhất`.
- [x] Bấm `Xem bài` sẽ điều hướng qua `/songs` kèm query param filter theo tập sách.
- [x] Đảm bảo tập sách mới có thể dùng khi thêm bài hát.

### Bước 8: Dọn UI và nội dung

- [x] Đối chiếu UI với recommendation từ `ui-ux-pro-max`.
- [x] Đảm bảo chỉ dùng Ant Design làm UI library chính.
- [x] Xóa hoặc không tạo các UI ngoài scope.
- [x] Kiểm tra toàn bộ copy tiếng Việt.
- [x] Kiểm tra link PDF mở được trong tab mới nếu có URL.
- [ ] Kiểm tra layout không vỡ ở desktop và mobile cơ bản.

### Bước 9: Setup NocoDB Cloud sau khi FE/BE chạy ổn

- [x] (Phía bạn) Chốt dùng NocoDB Cloud cho giai đoạn tiếp theo.
- [x] (Phía bạn) Tạo workspace/base cho project demo.
- [x] (Phía bạn) Tạo bảng `SongBooks` với field tối thiểu:
  - [x] Không dùng trường `id` trong logic nghiệp vụ/app.
  - [x] `songBookId` (Single line text hoặc Number, bắt buộc, unique).
  - [x] `name` (Single line text, bắt buộc).
  - [x] `createdAt` (tuỳ chọn, có thể dùng field hệ thống).
- [x] (Phía bạn) Tạo bảng `Songs` với field tối thiểu:
  - [x] Không dùng trường `id` trong logic nghiệp vụ/app.
  - [x] `title` (Single line text, bắt buộc).
  - [x] `firstLine` (Long text hoặc Single line text, không bắt buộc).
  - [x] `author` (Single line text, bắt buộc).
  - [x] `songBookId` (Single line text, bắt buộc, join với `SongBooks.songBookId`).
  - [x] `pageNumber` (Number, bắt buộc; khuyến nghị unique theo cặp `songBookId` + `pageNumber`).
  - [x] `linkPdf` (URL hoặc Single line text, không bắt buộc).
  - [x] `createdAt` (tuỳ chọn, có thể dùng field hệ thống).
- [x] (Phía bạn) Seed dữ liệu demo:
  - [x] Ít nhất 2 `SongBooks`.
  - [x] Ít nhất 5 `Songs`.
  - [x] Ít nhất 1 bài có `linkPdf`.
  - [x] Có dữ liệu tiếng Việt có dấu để test search.
- [x] (Phía bạn) Tạo API token (token dùng header `xc-token`).
- [x] (Phía bạn) Lấy `NOCODB_BASE_URL` (domain gốc của instance NocoDB bạn đang dùng).
- [x] (Phía bạn) Chốt cấu hình API bảng theo Table ID:
  - [x] `NOCODB_SONG_BOOKS_TABLE_ID`
  - [x] `NOCODB_SONGS_TABLE_ID`
- [x] (Phía bạn) Điền `backend/.env`:
  - [x] `DATA_ADAPTER=nocodb`
  - [x] `NOCODB_BASE_URL=...`
  - [x] `NOCODB_API_TOKEN=...`
  - [x] table id theo cấu hình ở trên.
- [x] (Phía bạn) Chạy test nhanh kết nối NocoDB qua backend:
  - [x] `GET /api/health` trả `adapter: nocodb`.
  - [x] `GET /api/song-books` đọc được dữ liệu từ NocoDB.
  - [x] `GET /api/songs` đọc được dữ liệu từ NocoDB.

### Bước 10: Hoàn thiện backend NocoDB-only

- [x] Tạo `NocoDBDataAdapter`.
- [x] Map response NocoDB về model chuẩn `Song` và `SongBook` theo schema mới (`songBookId` nghiệp vụ, bỏ `songBookNameSnapshot`).
- [x] Cố định backend chạy NocoDB-only (không còn cấu hình chọn mock adapter).
- [ ] Test lại 4 API backend với NocoDB Cloud (đã test `GET`, chưa chạy `POST` để tránh spam thêm dữ liệu demo).
- [x] Đảm bảo frontend không phụ thuộc field `id` tự sinh của NocoDB.

### Bước 11: Deploy FE và BE lên Vercel

- [x] Đã có Vercel Project cho `backend/` (Root Directory: `backend/`).
- [x] Backend env vars đã cấu hình và `GET /api/health` production trả OK.
- [x] Đã có Vercel Project cho `frontend/` (Root Directory: `frontend/`).
- [ ] Redeploy backend để nhận code mới (route `/`); hiện URL root backend vẫn trả `{"detail":"Not Found"}` vì chưa redeploy bản mới từ local.
- [ ] Cập nhật frontend env var `VITE_API_BASE_URL` trên Vercel; bản deploy hiện tại đang fallback về `http://127.0.0.1:8000`.
- [ ] Deploy frontend và smoke test FE gọi được BE production.

### Bước 12: Validation và README

- [x] Chạy lint nếu đã cấu hình.
- [x] Chạy build frontend.
- [x] Chạy backend local và test health check.
- [ ] Smoke test đầy đủ các luồng trong checklist QA.
- [x] Cập nhật README với cách chạy frontend, backend, cấu hình NocoDB và deploy Vercel.

## Việc tiếp theo (ưu tiên)

- [x] Chuẩn hóa backend theo schema mới: bỏ `songBookNameSnapshot`, join theo `songBookId` nghiệp vụ, không dùng `id` tự sinh cho logic nghiệp vụ.
- [x] Chuẩn hóa frontend theo schema mới: `SongBook` dùng `songBookId`, form thêm tập sách chỉ nhập `name` (frontend tự sinh `songBookId`), bỏ cột `Trang nhỏ nhất`.
- [x] Cố định runtime NocoDB-only: bỏ default/mock path (`DATA_ADAPTER=mock`) và xóa luồng fallback mock.
- [ ] Chạy lại smoke test 4 API và 3 màn hình chính (`/`, `/songs`, `/song-books`) với dữ liệu NocoDB thật.

## QA demo nhanh

- [ ] Chạy frontend dev server thành công.
- [ ] Chạy FastAPI backend dev server thành công.
- [x] Chạy `npm run build` cho frontend.
- [ ] Smoke test login:
  - [ ] Sai account bị chặn.
  - [ ] Đúng account vào được trang chính.
  - [ ] Logout quay về login.
- [ ] Smoke test FastAPI với NocoDB adapter sau khi setup NocoDB Cloud:
  - [x] Lấy được danh sách tập sách từ NocoDB.
  - [ ] Tạo được tập sách mới và lưu vào NocoDB.
  - [x] Lấy được danh sách bài hát từ NocoDB.
  - [ ] Tạo được bài hát mới và lưu vào NocoDB.
- [ ] Smoke test deploy Vercel:
  - [x] Backend Vercel trả về OK ở `GET /api/health`.
  - [ ] Frontend Vercel gọi được backend qua `VITE_API_BASE_URL`.
  - [ ] Không có NocoDB token trong frontend env hoặc client bundle.
- [ ] Smoke test search:
  - [ ] Tìm theo tên bài hát có dấu.
  - [ ] Tìm theo tên bài hát không dấu.
  - [ ] Tìm theo câu đầu.
- [ ] Smoke test thêm bài hát:
  - [ ] Thiếu tên bài hát bị lỗi.
  - [ ] Thiếu tác giả bị lỗi.
  - [ ] Thiếu tập sách bị lỗi.
  - [ ] Đủ dữ liệu thì tạo được và hiện trong list.
- [ ] Smoke test tập sách:
  - [ ] Thêm tập sách mới chỉ với tên (không cần nhập mã thủ công).
  - [ ] Tập mới xuất hiện trong dropdown chọn sách khi thêm bài hát.
  - [ ] Bấm vào tập sách thấy đúng danh sách bài hát thuộc tập.

## Tiêu chí xong demo

- [ ] Người demo login được bằng account cố định.
- [ ] FE và BE chạy local với dữ liệu thật từ NocoDB Cloud.
- [ ] Dữ liệu bài hát và tập sách cuối cùng được đọc từ NocoDB Cloud qua FastAPI.
- [ ] Người demo tìm bài hát theo tên hoặc câu đầu được.
- [ ] Người demo thêm bài hát mới với đúng 6 trường được.
- [ ] Bài hát mới được lưu vào NocoDB Cloud và hiển thị lại trên UI.
- [ ] Người demo xem danh sách bài hát được.
- [ ] Người demo thêm tập sách mới được.
- [ ] Tập sách mới được lưu vào NocoDB Cloud và dùng được khi thêm bài hát.
- [ ] Người demo xem bài hát trong từng tập sách được.
- [ ] Frontend và backend deploy được lên Vercel từ cùng một repo bằng 2 Vercel Projects riêng.
- [ ] Không còn UI gây hiểu nhầm về tính năng chưa làm như OCR, upload file, Supabase, activity log, archive, soft delete.

## Cập nhật triển khai 2026-05-16

### Đã hoàn thành trong codebase

- [x] Chuẩn hóa backend model theo schema nghiệp vụ:
  - [x] `SongBook`: `songBookId`, `name`.
  - [x] `Song`: `title`, `firstLine`, `author`, `songBookId`, `pageNumber`, `linkPdf`.
- [x] `POST /api/song-books` nhận đúng 2 field: `songBookId`, `name`.
- [x] `POST /api/songs` giữ đúng 6 field demo.
- [x] Cố định backend NocoDB-only:
  - [x] Bỏ cấu hình chọn adapter mock.
  - [x] Xóa `backend/adapters/mock_adapter.py`.
  - [x] Cập nhật `backend/.env.example` theo NocoDB bắt buộc.
- [x] Backend trả lỗi cấu hình rõ ràng khi chưa sẵn sàng dữ liệu (`503` ở API dữ liệu).
- [x] Chuẩn hóa frontend theo schema mới:
  - [x] Dùng `songBookId` xuyên suốt ở type/API/UI.
  - [x] Bỏ phụ thuộc `id` tự sinh và `songBookNameSnapshot`.
  - [x] Form thêm tập sách chỉ nhập `name` (frontend tự sinh `songBookId`).
  - [x] Trang `/song-books` bỏ cột `Trang nhỏ nhất`.
- [x] UI tập sách hiển thị tối giản theo yêu cầu người dùng:
  - [x] Danh sách tập sách chỉ hiển thị tên tập.
  - [x] Dropdown chọn tập sách chỉ hiển thị tên (không hiển thị mã kỹ thuật).
- [x] Bổ sung route `GET /` cho backend để dễ kiểm tra deploy.
- [x] Đã backfill dữ liệu `SongBooks.songBookId` trên NocoDB để khôi phục liên kết với `Songs.songBookId`.
- [x] Đã xóa field `songBookNameSnapshot` khỏi bảng `Songs` trên NocoDB.
- [x] Sửa helper normalize tiếng Việt (`đ/Đ`) để search có dấu/không dấu đúng.
- [x] Cập nhật README theo NocoDB-only + schema mới.
- [x] Bổ sung responsive CSS cơ bản cho header/content trên mobile.

### Validation đã chạy

- [x] `frontend`: `npm run lint`.
- [x] `frontend`: `npm run build`.
- [x] `backend`: `python -m compileall .`.
- [x] `backend`: smoke test API bằng FastAPI TestClient.

### Mục đang bị chặn hiện tại

- [ ] Chưa redeploy backend production sau khi thêm route `/`, nên URL root backend vẫn đang `404`.
- [ ] Chưa chạy test `POST /api/song-books` và `POST /api/songs` trên production để tránh tạo thêm dữ liệu rác trong bảng demo.
- [ ] Frontend production đang build với `API_BASE_URL` local (`127.0.0.1:8000`), nên chưa gọi được backend Vercel.
- [ ] Một số record cũ ở bảng `Songs` còn thiếu `author` hoặc `pageNumber`; backend đang bỏ qua các record không hợp lệ theo schema.

### Mục chờ bạn thực hiện/duyệt

- [x] Cập nhật schema thật trên NocoDB:
  - [x] Đã thêm cột `songBookId` vào bảng `SongBooks`.
  - [x] Đã backfill `songBookId` cho dữ liệu cũ theo `Id` hiện có để giữ liên kết dữ liệu.
- [ ] Redeploy backend Vercel từ dashboard hoặc CLI đã đăng nhập để áp dụng route `/` mới.
- [ ] Chạy smoke test production cho 2 API tạo mới (`POST /api/song-books`, `POST /api/songs`) với dữ liệu kiểm thử tối thiểu.
