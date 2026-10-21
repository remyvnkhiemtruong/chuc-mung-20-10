# Gửi thương · 20/10

Website tĩnh chúc mừng ngày Phụ nữ Việt Nam, từ Trương Minh Khiêm.

## Bốn đường dẫn riêng

- Bảo Uyên: `bao-uyen/`
- Kim Phượng: `kim-phuong/`
- Huyền Dịu: `huyen-diu/`
- Nguyệt Ánh: `nguyet-anh/`

Mỗi trang có ảnh riêng, mở thư, cánh hoa khi mở, ảnh nghiêng theo con trỏ, xem ảnh đầy đủ, thêm lời chúc và lưu lá thư. Bố cục có phiên bản điện thoại và máy tính, hỗ trợ sáng/tối và giảm chuyển động. Các trang cá nhân không liên kết sang thiệp của người khác. Đây là website công khai, không có mật khẩu; người có đường dẫn có thể đọc nội dung.

Ảnh hiển thị được tối ưu thành WebP, không thay đổi khuôn mặt hay màu sắc. Nút xem ảnh mở toàn bộ khung hình. Font Be Vietnam Pro và Noto Serif hỗ trợ tiếng Việt và được lưu cùng website.

## Thay ảnh

Đặt các ảnh gốc dưới `source-photos/` với tên `bao-uyen.png`, `kim-phuong.png`, `huyen-diu.png`, `nguyet-anh.png`. Chạy `node scripts/prepare-photos.mjs` để tạo ảnh WebP 480/960/1440, rồi build và đẩy thư mục `public` lên GitHub. Ảnh gốc không được đưa vào Git, ảnh WebP được đưa cùng website.

## Chỉnh nội dung

1. Sửa tên, lời chúc hoặc người gửi trong `recipients.json`.
2. Chạy `npm ci`, rồi `npm run build`.
3. Đẩy cả nội dung cấu hình lẫn thư mục `public` lên nhánh `main`.

Giữ nguyên `slug` để QR đã in tiếp tục dùng được. Nếu đổi tài khoản hoặc tên repository, sửa `baseUrl` rồi build lại và thay QR cũ.

## GitHub Pages

Trong Settings → Pages → Source, chọn **GitHub Actions**. Workflow `.github/workflows/pages.yml` tự đăng thư mục `public` mỗi khi cập nhật nhánh `main`.

Trang chủ có bốn thiệp và QR tải xuống. QR PNG 1000×1000 và SVG có trong `public/qr/`; SVG phù hợp để in. QR đã mã hóa đường dẫn đầy đủ tới từng người, không phải trang chủ. Thử quét QR sau khi website hoạt động trước khi in hàng loạt.

## Xem ở máy

Chạy `npm run dev`, rồi mở `http://localhost:4173/`.
