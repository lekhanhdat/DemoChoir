# Demo MVP Tasklist - Gia Phuoc Choir

Mục tiêu: ship demo nhanh nhất có thể, chỉ giữ các luồng tối thiểu để người dùng thấy được giá trị chính: đăng nhập, tìm bài hát, thêm bài hát, xem danh sách bài hát và tệp sách.

## Nguyên tắc cắt scope

- Không nối Supabase trong demo; dùng repository/mock data hiện có là đủ.
- Không làm upload file; trường `link pdf` chỉ là một URL text.
- Không làm OCR, activity log, soft delete/archive, phân quyền, audit, restore, import/export.
- Không làm edit/xóa cho demo trừ khi còn thời gian sau khi luồng chính chạy ổn.
- Không thêm metadata nâng cao như mùa phụng vụ, chủ đề, vị trí hát, số trang, số thứ tự.
- Ưu tiên UI ít trang, ít thao tác, dễ demo trên màn hình lớn.

## Account demo

- [ ] Tạo trang `/login`.
- [ ] Hardcode account demo:
  - Username: `demo`
  - Password: `demo123`
- [ ] Khi login đúng, lưu trạng thái đơn giản ở client (`localStorage` hoặc cookie demo).
- [ ] Khi chưa login, redirect các trang chính về `/login`.
- [ ] Header hiển thị user cố định: `Ca trưởng (demo)`.
- [ ] Có nút đăng xuất, xóa trạng thái login và quay về `/login`.

## Luồng 1 + 2: Search và thêm bài hát trên cùng một page

Route đề xuất: `/`

- [ ] Đổi trang chủ thành page chính sau login: "Tra cứu & thêm bài hát".
- [ ] Giữ ô search lớn ở trên cùng.
- [ ] Search chỉ cần tìm theo:
  - Tên bài hát.
  - Câu đầu.
- [ ] Search hỗ trợ có dấu/không dấu bằng helper normalize hiện có.
- [ ] Bên dưới search hiển thị danh sách kết quả tối giản gồm:
  - Tên bài hát.
  - Câu đầu.
  - Tác giả.
  - Tệp sách.
  - Link PDF nếu có.
- [ ] Thêm nút hoặc form "Thêm bài hát mới" ngay trên cùng page.
- [ ] Form thêm bài hát chỉ có 5 trường:
  - `Tên bài hát` - bắt buộc.
  - `Câu đầu` - không bắt buộc.
  - `Tác giả` - bắt buộc.
  - `Nằm trong sách nào` - bắt buộc, chọn từ danh sách tệp sách.
  - `Link PDF` - không bắt buộc.
- [ ] Sau khi thêm thành công, bài hát mới xuất hiện ngay trong kết quả/list.
- [ ] Nếu thiếu trường bắt buộc, hiển thị lỗi ngắn ngay tại form.

## Luồng 3a: Xem list bài hát

Route đề xuất: `/songs`

- [ ] Đổi trang `/songs` thành danh sách chỉ xem.
- [ ] Không hiển thị nút sửa, xóa mềm, trạng thái, activity log.
- [ ] Bảng chỉ cần các cột:
  - Tên bài hát.
  - Câu đầu.
  - Tác giả.
  - Tệp sách.
  - Link PDF.
- [ ] Có ô tìm nhanh theo tên bài hát hoặc câu đầu nếu tái dùng được code search hiện có.
- [ ] Chỉ hiển thị bài hát active/demo, không cần filter trạng thái.

## Luồng 3b: Xem list tệp sách và bài hát trong tệp

Route đề xuất: `/song-books`

- [ ] Đổi trang `/song-books` thành trang quản lý tệp sách tối giản.
- [ ] Phần trên có nút/form "Thêm tệp sách mới".
- [ ] Form thêm tệp sách chỉ có 1 trường:
  - `Tên tệp sách` - bắt buộc.
- [ ] Bên dưới hiển thị danh sách tệp sách.
- [ ] Mỗi dòng tệp sách hiển thị:
  - Tên tệp sách.
  - Số bài hát thuộc tệp đó.
- [ ] Khi bấm vào một tệp sách, hiển thị danh sách bài hát thuộc tệp đó bằng Drawer hoặc panel bên phải.
- [ ] Danh sách bài hát trong tệp chỉ cần:
  - Tên bài hát.
  - Câu đầu.
  - Tác giả.
  - Link PDF.
- [ ] Không cần sửa/xóa/archive tệp sách trong demo.

## Điều chỉnh data/API tối thiểu

- [ ] Bổ sung field `pdfUrl` hoặc `pdfLink` cho bài hát trong type/schema/mock data.
- [ ] API tạo bài hát chỉ nhận 5 trường demo.
- [ ] API tạo tệp sách chỉ nhận `name`.
- [ ] Khi tạo bài hát, tự fill các field hệ thống còn lại bằng giá trị mặc định để tương thích type hiện có.
- [ ] Khi chọn tệp sách cho bài hát, lưu cả `bookId` và `bookNameSnapshot`.
- [ ] Nếu chưa có backend thật, chấp nhận dữ liệu reset khi restart server trong demo.

## Điều chỉnh navigation/UI

- [ ] Sidebar chỉ giữ:
  - Tra cứu & thêm.
  - Bài hát.
  - Tệp sách.
- [ ] Ẩn route/menu "Nhật ký".
- [ ] Đổi copy UI về tiếng Việt đúng encoding.
- [ ] Bỏ các card/filter nâng cao không phục vụ demo.
- [ ] Trên mobile/tablet, form thêm bài hát và bảng vẫn xem được nhưng không cần tối ưu quá sâu.

## QA demo nhanh

- [ ] Chạy `npm run lint`.
- [ ] Chạy `npm run build`.
- [ ] Smoke test login:
  - Sai account bị chặn.
  - Đúng account vào được trang chính.
  - Logout quay về login.
- [ ] Smoke test search:
  - Tìm theo tên bài hát có dấu.
  - Tìm theo tên bài hát không dấu.
  - Tìm theo câu đầu.
- [ ] Smoke test thêm bài hát:
  - Thiếu tên bài hát bị lỗi.
  - Thiếu tác giả bị lỗi.
  - Thiếu tệp sách bị lỗi.
  - Đủ dữ liệu thì tạo được và hiện trong list.
- [ ] Smoke test tệp sách:
  - Thêm tệp sách mới chỉ bằng tên.
  - Tệp mới xuất hiện trong dropdown chọn sách khi thêm bài hát.
  - Bấm vào tệp sách thấy đúng danh sách bài hát thuộc tệp.

## Thứ tự triển khai nhanh nhất

1. Cắt navigation và ẩn activity log.
2. Làm hardcoded login.
3. Thêm field link PDF vào type/schema/mock/API.
4. Làm lại trang chủ thành search + add song 5 trường.
5. Rút gọn `/songs` thành list chỉ xem.
6. Rút gọn `/song-books` thành thêm tệp sách + xem bài trong tệp.
7. Chạy lint/build và smoke test theo checklist.

## Tiêu chí xong demo

- [ ] Người demo login được bằng account cố định.
- [ ] Người demo tìm bài hát theo tên hoặc câu đầu được.
- [ ] Người demo thêm bài hát mới với đúng 5 trường được.
- [ ] Người demo xem danh sách bài hát được.
- [ ] Người demo thêm tệp sách mới và xem bài hát trong từng tệp sách được.
- [ ] Không còn UI gây hiểu nhầm về tính năng chưa làm như OCR, upload, Supabase, activity log, archive, soft delete.
