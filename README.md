# MathLingua AI — Bản demo điều hướng

Đây là prototype frontend tĩnh dùng các ảnh giao diện Canva người dùng cung cấp làm artwork, với các nút điều hướng và vùng bấm được tách thành phần HTML độc lập.

## Cách chạy

**Cách đơn giản:** giải nén thư mục, mở `index.html` trong trình duyệt Chrome hoặc Edge.

**Cách chạy qua máy chủ cục bộ (khuyến nghị):** mở Terminal/Command Prompt tại thư mục này và chạy:

```bash
python -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Điều hướng đã triển khai

- Thanh điều hướng dùng chung cho Trang chủ, Thư viện chủ đề, Math Lab, MathBuddy AI và My Progress.
- Trang chủ: nút “Bắt đầu hành trình” mở Thư viện chủ đề.
- Thư viện chủ đề: Fraction → Chapter 1; Decimal Numbers → Chapter 2; Ratio and Percentage → Chapter 3; Geometry and Measurement → Chapter 4.
- Chapter 1–4: nút/quy vùng “Back to Topics Library” quay lại Thư viện chủ đề.
- Các thẻ Unit mở hộp thoại xem trước và câu hỏi mẫu có đáp án kiểm tra được.
- Math Lab: các trò chơi mở demo tương tác đơn giản; 3D Shape Studio có khối lập phương CSS 3D xoay.
- MathBuddy AI: các chủ đề từ vựng và hai lựa chọn Practice with Model Sentences / Math Dialogue mở các hộp thoại xem trước.
- My Progress: các liên kết xem chi tiết và “Ôn tập ngay” hoạt động ở mức demo.
- Đăng nhập mở hộp thoại chọn vai trò demo; chưa có xác thực tài khoản thật hoặc backend.
- URL hash và nút Back/Forward của trình duyệt được hỗ trợ.

## Phạm vi hiện tại và giới hạn

- Các ảnh Canva vẫn là artwork nền; nút điều hướng và vùng bấm chính là layer HTML riêng. Phần chữ/đồ họa nằm bên trong các ảnh vẫn là ảnh phẳng, chưa được chuyển hết thành từng layer có thể chỉnh sửa.
- Dữ liệu điểm số là minh họa; chưa có cơ sở dữ liệu, đồng bộ tiến độ giữa thiết bị hoặc tài khoản thật.
- MathBuddy AI là mô phỏng UI; chưa gọi API AI. Speak & Pronounce có nút đọc câu mẫu qua Speech Synthesis nếu trình duyệt hỗ trợ; chưa có ghi âm/chấm phát âm.
- Đây là bản demo desktop-first; ảnh gốc giữ nguyên tỷ lệ thiết kế. Trên màn hình hẹp có thể cần cuộn ngang để xem artwork đầy đủ.

## Cấu trúc

- `index.html`: ứng dụng và vùng render trang
- `styles.css`: thiết kế, responsive và modal
- `app.js`: routing, hotspot, dialog và demo interaction
- `assets/`: ảnh đã tối ưu WebP; `nav-bar.webp` được cắt khỏi khoảng trắng của file thanh điều hướng, hai ảnh Math Lab/MathBuddy và ảnh My Progress được bỏ vùng header trống/embedded để dùng thanh điều hướng chung.
