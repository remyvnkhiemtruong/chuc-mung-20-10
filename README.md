# Gửi thương · 20/10

Website tĩnh chúc mừng ngày Phụ nữ Việt Nam, từ Trương Minh Khiêm.

## Bốn đường dẫn riêng

- Bảo Uyên: `bao-uyen/`
- Kim Phượng: `kim-phuong/`
- Huyền Dịu: `huyen-diu/`
- Nguyệt Ánh: `nguyet-anh/`

Mỗi trang có lời chúc riêng, mở thư, hiệu ứng cánh hoa, nút lưu lời chúc, giao diện điện thoại, chế độ sáng/tối và hỗ trợ giảm chuyển động. Các trang cá nhân không liên kết sang thiệp của người khác. Đây là website công khai, không có mật khẩu; người có đường dẫn có thể đọc nội dung.

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
