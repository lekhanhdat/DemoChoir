# Demo MVP Tasklist - Gia Phuoc Choir

Mục tiêu: dựng nhanh một demo MVP cho repo mới, đủ để người dùng thấy được các giá trị chính: đăng nhập demo, tra cứu bài hát, thêm bài hát, xem danh sách bài hát, quản lý tập sách và xem bài hát theo từng tập sách.

## Định hướng kỹ thuật

- Frontend: ReactJS, ưu tiên Vite để khởi tạo nhanh.
- Routing: React Router.
- UI/CSS: chọn Ant Design làm UI library chính để đồng bộ form, table, layout, drawer, alert và validation.
- Thiết kế giao diện: sử dụng skill `ui-ux-pro-max` để định hướng design system trước khi triển khai UI.
- Backend: Python + FastAPI.
- Data source cuối cùng: NocoDB Cloud.
- Trong giai đoạn đầu, backend có thể dùng mock/in-memory adapter để chạy FE/BE trước khi setup NocoDB.
- Auth demo: hardcode account ở frontend hoặc backend, chưa cần bảng user thật.
- Repo này là repo mới, vì vậy không phụ thuộc mock data, schema cũ, Supabase hay migration cũ.
- Cấu trúc deploy: giữ frontend và backend trong cùng một repo, tách thành 2 folder `frontend/` và `backend/`.

## Nguyên tắc cắt scope

- Không dùng Supabase trong demo.
- Không làm upload file; trường `linkPdf` chỉ là một URL text.
- Không làm OCR, activity log, soft delete/archive, phân quyền nâng cao, audit, restore, import/export.
- Không làm sửa/xóa trong demo trừ khi còn thời gian sau khi luồng chính chạy ổn.
- Không thêm metadata nâng cao như mùa phụng vụ, chủ đề, vị trí hát, số trang, số thứ tự.
- Ưu tiên UI ít trang, ít thao tác, dễ demo trên màn hình lớn.
- Ưu tiên hoàn thành end-to-end local trước: React UI -> FastAPI mock adapter -> hiển thị lại dữ liệu.
- Sau khi FE/BE chạy ổn, mới nối FastAPI -> NocoDB Cloud.
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

- [ ] Tạo workspace/base trong NocoDB cho demo Gia Phuoc Choir.
- [ ] Tạo bảng `SongBooks`.
  - [ ] `id` - khóa chính do NocoDB tạo.
  - [ ] `name` - tên tập sách, bắt buộc.
  - [ ] `createdAt` - ngày tạo, có thể dùng field hệ thống của NocoDB.
- [ ] Tạo bảng `Songs`.
  - [ ] `id` - khóa chính do NocoDB tạo.
  - [ ] `title` - tên bài hát, bắt buộc.
  - [ ] `firstLine` - câu đầu, không bắt buộc.
  - [ ] `author` - tác giả, bắt buộc.
  - [ ] `songBookId` - id tập sách, bắt buộc.
  - [ ] `songBookNameSnapshot` - tên tập sách tại thời điểm tạo bài, bắt buộc.
  - [ ] `linkPdf` - URL PDF, không bắt buộc.
  - [ ] `createdAt` - ngày tạo, có thể dùng field hệ thống của NocoDB.
- [ ] Seed dữ liệu demo ban đầu.
  - [ ] Tạo ít nhất 2 tập sách mẫu.
  - [ ] Tạo ít nhất 5 bài hát mẫu.
  - [ ] Có ít nhất 1 bài có `linkPdf`.
  - [ ] Có dữ liệu tiếng Việt có dấu để test search.
- [ ] Lấy thông tin kết nối NocoDB.
  - [ ] Base URL.
  - [ ] API token.
  - [ ] Table ID hoặc endpoint cho `Songs`.
  - [ ] Table ID hoặc endpoint cho `SongBooks`.

## Backend Python + FastAPI

- [ ] Dùng backend mỏng để gọi NocoDB, tránh để lộ API token ở frontend.
- [ ] Backend chỉ làm các API tối thiểu:
  - [ ] `GET /api/song-books`
  - [ ] `POST /api/song-books`
  - [ ] `GET /api/songs`
  - [ ] `POST /api/songs`
- [ ] Frontend chỉ gọi backend qua `VITE_API_BASE_URL`.
- [ ] Tạo app FastAPI tối giản.
- [ ] Cài package cần thiết: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`.
- [ ] Tạo CORS config cho local frontend và domain frontend Vercel.
- [ ] Tạo data adapter interface để dễ đổi nguồn dữ liệu:
  - [ ] `MockDataAdapter` dùng cho giai đoạn chưa setup NocoDB.
  - [ ] `NocoDBDataAdapter` dùng sau khi có NocoDB Cloud.
- [ ] Giai đoạn đầu dùng `MockDataAdapter` để FE/BE chạy được ngay.
- [ ] Sau khi có NocoDB, tạo module client gọi NocoDB bằng `httpx`.
- [ ] Đọc NocoDB config từ `.env`.
- [ ] Thêm validation đơn giản trước khi ghi dữ liệu.

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
  - [ ] Tập sách.
  - [ ] Link PDF nếu có.
- [ ] Thêm form `Thêm bài hát mới` trên cùng page.
- [ ] Dùng Ant Design `Form`, `Input`, `Select`, `Button` cho form thêm bài hát.
- [ ] Form thêm bài hát chỉ có 5 trường:
  - [ ] `Tên bài hát` - bắt buộc.
  - [ ] `Câu đầu` - không bắt buộc.
  - [ ] `Tác giả` - bắt buộc.
  - [ ] `Nằm trong sách nào` - bắt buộc, chọn từ danh sách tập sách.
  - [ ] `Link PDF` - không bắt buộc.
- [ ] Khi submit form:
  - [ ] Validate các trường bắt buộc ở frontend.
  - [ ] Gửi request tạo bài hát tới FastAPI.
  - [ ] Lưu `songBookId` và `songBookNameSnapshot`.
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
  - [ ] Tập sách.
  - [ ] Link PDF.
- [ ] Có ô tìm nhanh theo tên bài hát hoặc câu đầu.
- [ ] Tái sử dụng helper search normalize từ page chính.
- [ ] Không hiển thị nút sửa, xóa mềm, trạng thái, activity log.
- [ ] Nếu chưa có bài hát, hiển thị Ant Design `Empty` với nội dung ngắn: `Chưa có bài hát nào`.

## Luồng 3b: Xem tập sách và bài hát trong tập

Route đề xuất: `/song-books`

- [ ] Tạo page `/song-books` quản lý tập sách tối giản.
- [ ] Khi page load, gọi FastAPI lấy danh sách tập sách và bài hát.
- [ ] Phần trên có form `Thêm tập sách mới`.
- [ ] Dùng Ant Design `Form`, `Input`, `Button` cho form thêm tập sách.
- [ ] Form thêm tập sách chỉ có 1 trường:
  - [ ] `Tên tập sách` - bắt buộc.
- [ ] Khi submit form:
  - [ ] Validate tên tập sách.
  - [ ] Gửi request tạo tập sách tới FastAPI.
  - [ ] Reset form.
  - [ ] Refresh danh sách tập sách hoặc append tập mới vào state hiện tại.
- [ ] Bên dưới hiển thị danh sách tập sách.
- [ ] Mỗi dòng tập sách hiển thị:
  - [ ] Tên tập sách.
  - [ ] Số bài hát thuộc tập đó.
- [ ] Khi bấm vào một tập sách, hiển thị danh sách bài hát thuộc tập đó bằng drawer hoặc panel bên phải.
- [ ] Ưu tiên Ant Design `Drawer` cho danh sách bài hát trong tập để triển khai nhanh và đồng bộ.
- [ ] Danh sách bài hát trong tập chỉ cần:
  - [ ] Tên bài hát.
  - [ ] Câu đầu.
  - [ ] Tác giả.
  - [ ] Link PDF.
- [ ] Tập sách mới phải xuất hiện trong dropdown chọn sách ở form thêm bài hát.
- [ ] Không cần sửa/xóa/archive tập sách trong demo.

## API và mapping dữ liệu

- [ ] Chuẩn hóa model phía frontend:
  - [ ] `Song`: `id`, `title`, `firstLine`, `author`, `songBookId`, `songBookNameSnapshot`, `linkPdf`.
  - [ ] `SongBook`: `id`, `name`.
- [ ] Nếu dùng backend, chuẩn hóa response trước khi trả về frontend để frontend không phụ thuộc trực tiếp vào tên field nội bộ của NocoDB.
- [ ] API tạo bài hát chỉ nhận 5 field demo:
  - [ ] `title`
  - [ ] `firstLine`
  - [ ] `author`
  - [ ] `songBookId`
  - [ ] `linkPdf`
- [ ] Khi tạo bài hát, backend hoặc frontend tự tìm `songBookNameSnapshot` từ danh sách tập sách.
- [ ] API tạo tập sách chỉ nhận `name`.
- [ ] Không lưu dữ liệu demo trong local mock nếu NocoDB đã kết nối thành công.
- [ ] Chỉ dùng local mock tạm thời khi chưa có NocoDB credentials, và đánh dấu rõ trong code/README.

## Step-by-step triển khai đề xuất

### Bước 1: Khởi tạo mono-repo FE/BE

- [ ] Tạo folder `frontend/` cho React app.
- [ ] Tạo React app bằng Vite trong `frontend/`.
- [ ] Cài React Router.
- [ ] Cài Ant Design và icon package: `antd`, `@ant-design/icons`.
- [ ] Import `antd/dist/reset.css` trong entry app.
- [ ] Tạo folder `backend/` cho FastAPI app.
- [ ] Tạo `backend/app.py` hoặc `backend/index.py` với `app = FastAPI()`.
- [ ] Tạo `backend/requirements.txt` hoặc `backend/pyproject.toml`.
- [ ] Cài package backend: `fastapi`, `uvicorn`, `python-dotenv`, `httpx`.

### Bước 2: Chạy backend trước với mock adapter

- [ ] Tạo endpoint health check: `GET /api/health`.
- [ ] Tạo `MockDataAdapter` chứa dữ liệu mẫu trong memory hoặc file seed nội bộ.
- [ ] Tạo API đọc danh sách tập sách: `GET /api/song-books`.
- [ ] Tạo API tạo tập sách: `POST /api/song-books`.
- [ ] Tạo API đọc danh sách bài hát: `GET /api/songs`.
- [ ] Tạo API tạo bài hát: `POST /api/songs`.
- [ ] Test từng endpoint bằng REST client khi chưa có NocoDB.
- [ ] Ghi chú rõ: mock/in-memory chỉ dùng để phát triển local, không dùng làm data production.

### Bước 3: Làm app shell và login demo

- [ ] Tạo các route rỗng: `/login`, `/`, `/songs`, `/song-books`.
- [ ] Tạo app shell cơ bản cho các route sau login.
- [ ] Tạo UI login bằng Ant Design `Form`, `Input.Password`, `Button`, `Alert`.
- [ ] Validate username/password hardcode.
- [ ] Lưu trạng thái login vào `localStorage`.
- [ ] Tạo route guard cho các page chính.
- [ ] Tạo logout trong header.

### Bước 4: Nối frontend với FastAPI

- [ ] Tạo file service/API client phía frontend.
- [ ] Cấu hình `VITE_API_BASE_URL`.
- [ ] Implement hàm `getSongs`.
- [ ] Implement hàm `createSong`.
- [ ] Implement hàm `getSongBooks`.
- [ ] Implement hàm `createSongBook`.
- [ ] Thêm trạng thái loading/error cho từng page.
- [ ] Chạy song song frontend và backend local để xác nhận FE gọi được BE.

### Bước 5: Làm page Tra cứu & thêm

- [ ] Load bài hát và tập sách khi vào page.
- [ ] Làm helper normalize tiếng Việt cho search không dấu.
- [ ] Làm danh sách kết quả search bằng Ant Design `Table` hoặc `List`.
- [ ] Làm form thêm bài hát 5 trường bằng Ant Design `Form`.
- [ ] Validate form.
- [ ] Gửi API tạo bài hát.
- [ ] Refresh hoặc cập nhật state sau khi tạo thành công.

### Bước 6: Làm page Bài hát

- [ ] Load danh sách bài hát.
- [ ] Hiển thị bảng chỉ xem bằng Ant Design `Table`.
- [ ] Thêm ô tìm nhanh.
- [ ] Xử lý empty state và loading state.

### Bước 7: Làm page Tập sách

- [ ] Load danh sách tập sách và bài hát.
- [ ] Hiển thị form thêm tập sách bằng Ant Design `Form`.
- [ ] Hiển thị số bài hát theo từng tập.
- [ ] Làm Ant Design `Drawer` xem bài hát trong tập.
- [ ] Đảm bảo tập sách mới có thể dùng khi thêm bài hát.

### Bước 8: Dọn UI và nội dung

- [ ] Đối chiếu UI với recommendation từ `ui-ux-pro-max`.
- [ ] Đảm bảo chỉ dùng Ant Design làm UI library chính.
- [ ] Xóa hoặc không tạo các UI ngoài scope.
- [ ] Kiểm tra toàn bộ copy tiếng Việt.
- [ ] Kiểm tra link PDF mở được trong tab mới nếu có URL.
- [ ] Kiểm tra layout không vỡ ở desktop và mobile cơ bản.

### Bước 9: Setup NocoDB Cloud sau khi FE/BE chạy ổn

- [ ] Tạo NocoDB Cloud workspace/base.
- [ ] Tạo 2 bảng `Songs`, `SongBooks`.
- [ ] Tạo đúng các field tối thiểu như phần Setup NocoDB Cloud.
- [ ] Seed dữ liệu demo.
- [ ] Kiểm tra gọi được API NocoDB bằng Postman, curl hoặc REST client.
- [ ] Lưu NocoDB credentials vào `.env` local và Vercel Project backend.

### Bước 10: Đổi backend từ mock sang NocoDB

- [ ] Tạo `NocoDBDataAdapter`.
- [ ] Map response NocoDB về model chuẩn `Song` và `SongBook`.
- [ ] Đổi config backend để chọn adapter bằng env, ví dụ `DATA_ADAPTER=mock` hoặc `DATA_ADAPTER=nocodb`.
- [ ] Test lại 4 API backend với NocoDB Cloud.
- [ ] Đảm bảo frontend không cần đổi code khi backend đổi adapter.

### Bước 11: Deploy FE và BE lên Vercel

- [ ] Tạo Vercel Project cho `backend/`.
- [ ] Cấu hình backend env vars trên Vercel: `NOCODB_BASE_URL`, `NOCODB_API_TOKEN`, table id/endpoint cần thiết.
- [ ] Deploy backend và test `GET /api/health`.
- [ ] Tạo Vercel Project cho `frontend/`.
- [ ] Cấu hình frontend env var `VITE_API_BASE_URL` trỏ tới URL backend Vercel.
- [ ] Deploy frontend và smoke test FE gọi được BE production.

### Bước 12: Validation và README

- [ ] Chạy lint nếu đã cấu hình.
- [ ] Chạy build frontend.
- [ ] Chạy backend local và test health check.
- [ ] Smoke test đầy đủ các luồng trong checklist QA.
- [ ] Cập nhật README với cách chạy frontend, backend, cấu hình NocoDB và deploy Vercel.

## QA demo nhanh

- [ ] Chạy frontend dev server thành công.
- [ ] Chạy FastAPI backend dev server thành công.
- [ ] Chạy `npm run build` cho frontend.
- [ ] Smoke test login:
  - [ ] Sai account bị chặn.
  - [ ] Đúng account vào được trang chính.
  - [ ] Logout quay về login.
- [ ] Smoke test FastAPI với mock adapter trước khi có NocoDB:
  - [ ] Lấy được danh sách tập sách.
  - [ ] Tạo được tập sách mới.
  - [ ] Lấy được danh sách bài hát.
  - [ ] Tạo được bài hát mới.
- [ ] Smoke test FastAPI với NocoDB adapter sau khi setup NocoDB Cloud:
  - [ ] Lấy được danh sách tập sách từ NocoDB.
  - [ ] Tạo được tập sách mới và lưu vào NocoDB.
  - [ ] Lấy được danh sách bài hát từ NocoDB.
  - [ ] Tạo được bài hát mới và lưu vào NocoDB.
- [ ] Smoke test deploy Vercel:
  - [ ] Backend Vercel trả về OK ở `GET /api/health`.
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
  - [ ] Thêm tập sách mới chỉ bằng tên.
  - [ ] Tập mới xuất hiện trong dropdown chọn sách khi thêm bài hát.
  - [ ] Bấm vào tập sách thấy đúng danh sách bài hát thuộc tập.

## Tiêu chí xong demo

- [ ] Người demo login được bằng account cố định.
- [ ] FE và BE chạy được local trước khi setup NocoDB bằng mock adapter.
- [ ] Dữ liệu bài hát và tập sách cuối cùng được đọc từ NocoDB Cloud qua FastAPI.
- [ ] Người demo tìm bài hát theo tên hoặc câu đầu được.
- [ ] Người demo thêm bài hát mới với đúng 5 trường được.
- [ ] Bài hát mới được lưu vào NocoDB Cloud và hiển thị lại trên UI.
- [ ] Người demo xem danh sách bài hát được.
- [ ] Người demo thêm tập sách mới được.
- [ ] Tập sách mới được lưu vào NocoDB Cloud và dùng được khi thêm bài hát.
- [ ] Người demo xem bài hát trong từng tập sách được.
- [ ] Frontend và backend deploy được lên Vercel từ cùng một repo bằng 2 Vercel Projects riêng.
- [ ] Không còn UI gây hiểu nhầm về tính năng chưa làm như OCR, upload file, Supabase, activity log, archive, soft delete.
