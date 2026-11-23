# HƯỚNG DẪN NGHIỆP VỤ HỆ THỐNG QUẢN TRỊ ADMIN BETASHOP

Tài liệu tóm tắt quy trình vận hành và luồng nghiệp vụ chi tiết của từng module trong hệ thống Admin Betashop:

---

## 1. Module Tổng Quan (Dashboard - `/admin/dashboard`)
- **Mục tiêu:** Cung cấp bức tranh toàn cảnh thời gian thực về dòng tiền, đơn hàng và sức khỏe tồn kho.
- **Luồng nghiệp vụ:**
  - Theo dõi 4 chỉ số KPI chính: Tổng doanh thu, Đơn hàng chờ xử lý, Mặt hàng sắp hết và Khách hàng mới.
  - Theo dõi biến động doanh thu 30 ngày và tỷ lệ trạng thái đơn hàng.
  - Xem nhanh danh sách 10 đơn hàng mới nhất và danh sách cảnh báo tồn kho đỏ dưới định mức tối thiểu.

---

## 2. Module Sản Phẩm & Biến Thể (`/admin/products`, `[id]`, `variants`)
- **Mục tiêu:** Quản lý vòng đời sản phẩm gia dụng, mã SKU, barcode và quy cách kỹ thuật.
- **Luồng nghiệp vụ:**
  - **Thêm/Sửa sản phẩm:** Nhập thông tin, ảnh, thông số kỹ thuật (công suất W, dung tích L, điện áp V, bảng điều khiển), giá nhập, giá bán lẻ, định mức tồn kho tối thiểu.
  - **Ma trận biến thể:** Theo dõi mã SKU và barcode riêng biệt cho từng quy cách sản phẩm.
  - **Nhân bản (Duplicate) & Xuất Excel:** Nhân bản nhanh mẫu sản phẩm tương tự và xuất toàn bộ danh mục ra file Excel.

---

## 3. Module Danh Mục, Thương Hiệu & Nhà Cung Cấp (`/admin/categories`, `brands`, `suppliers`)
- **Danh mục:** Cấu trúc phân cấp đa tầng (Parent - Child) phù hợp ngành đồ gia dụng (Nhà bếp, Điện lạnh, Lọc nước, Thiết bị làm mát).
- **Thương hiệu:** Quản lý thương hiệu chính hãng đối tác (Philips, Sunhouse, Cuckoo, Elmich...) kèm xuất xứ.
- **Nhà cung cấp & Công nợ:** Theo dõi tổng giá trị nhập hàng, số tiền đã trả và công nợ còn lại phải thanh toán cho từng NCC.

---

## 4. Module Quản Lý Kho — TRỌNG TÂM (`/admin/inventory/*`)
- **Tồn kho hiện tại (`/stock`):**
  - Hiển thị theo 3 cột số liệu chuẩn: Tồn kho thực tế (Quantity) = Đang giữ theo đơn (Reserved) + Sẵn sàng bán (Available).
  - Cảnh báo màu: Đỏ (dưới định mức), Vàng (sắp hết), Xanh (an toàn).
- **Phiếu nhập kho (`/imports`):**
  - Nhập hàng từ NCC &rarr; Tự động cộng số lượng vào tồn kho của kho được chọn &rarr; Ghi nhận công nợ NCC &rarr; Hỗ trợ in phiếu nhập kho chuẩn khổ A4.
- **Phiếu xuất kho (`/exports`):**
  - Xuất hàng mẫu trưng bày showroom, xuất thanh lý hàng lỗi/hỏng, xuất trả hàng NCC &rarr; Tự động trừ tồn kho và ghi lý do xuất.
- **Chuyển kho nội bộ (`/transfers`):**
  - Quy trình 2 bước: Kho nguồn xuất điều chuyển &rarr; Kho đích xác nhận nhận đủ hàng &rarr; Cân bằng số liệu 2 kho.
- **Điều chỉnh kiểm kê (`/adjustments`):**
  - Nhập số lượng thực tế kiểm đếm &rarr; Hệ thống tự động tính chênh lệch thừa/thiếu &rarr; Cân bằng tồn kho về đúng số thực tế.
- **Nhật ký biến động kho (`/history`):**
  - Ghi nhận dấu vết kiểm toán (Audit Trail) cho mọi giao dịch nhập, xuất, bán hàng, chuyển kho và đổi trả.

---

## 5. Module Đơn Hàng, POS & Đổi Trả (`/admin/orders/*`)
- **Quản lý đơn hàng (`/admin/orders`, `[id]`):**
  - Quản lý đơn đa kênh (Web, App, POS) qua các tab tiến trình: Chờ xác nhận &rarr; Đã xác nhận &rarr; Đang đóng gói &rarr; Đang giao hàng &rarr; Đã hoàn thành.
  - In hóa đơn bán lẻ A4/A5 và tem vận chuyển.
- **Bán hàng tại quầy POS (`/admin/orders/pos`):**
  - Màn hình chuyên dụng cho thu ngân: Quét mã vạch Barcode, tìm nhanh sản phẩm, chọn khách hàng, chọn phương thức thanh toán (Tiền mặt, VietQR, Quẹt thẻ, MoMo), tự động tính tiền thối lại khách.
  - In hóa đơn nhiệt K80 tức thì qua máy in bill và tự động trừ kho tức thời.
- **Đổi trả hàng / Hoàn tiền (`/admin/orders/returns`):**
  - Lập phiếu trả hàng từ mã đơn gốc &rarr; Chọn phân loại hàng (còn nguyên seal nhập lại kho bán tiếp, hoặc hàng lỗi chuyển kho chờ trả NCC) &rarr; Hoàn tiền cho khách qua chuyển khoản/tiền mặt/voucher.

---

## 6. Module Khách Hàng (CRM - `/admin/customers`)
- Quản lý hồ sơ khách hàng, phân hạng tự động (Khách mới, Khách thân thiết, Khách hàng VIP).
- Theo dõi lịch sử đơn hàng, tổng chi tiêu tích lũy và điểm thưởng thành viên.

---

## 7. Module Marketing & Dịch Vụ (`/admin/coupons`, `promotions`, `shipping`, `reviews`)
- **Mã giảm giá:** Tạo mã voucher theo phần trăm (%) hoặc số tiền cố định (₫), đơn tối thiểu và giới hạn lượt dùng.
- **Khuyến mãi:** Thiết lập chiến dịch Flash Sale đếm ngược, combo đồ gia dụng và mua X tặng Y.
- **Vận chuyển:** Cấu hình bảng phí ship theo tỉnh thành và ngưỡng miễn phí ship.
- **Đánh giá:** Kiểm duyệt nhận xét của khách hàng và phản hồi thắc mắc dịch vụ.

---

## 8. Module Báo Cáo & Thống Kê (`/admin/reports/*`)
- **Báo cáo doanh thu & Lợi nhuận gộp:** Phân tích doanh thu, giá vốn hàng bán (COGS) và biên lợi nhuận thuần.
- **Báo cáo tồn kho:** Định giá tổng vốn lưu động đang nằm trong kho hàng.
- **Báo cáo sản phẩm:** Bảng xếp hạng sản phẩm bán chạy nhất và tỷ trọng đóng góp doanh số.
- **Báo cáo khách hàng:** Phân khúc khách hàng chi tiêu nhiều nhất.
- Hỗ trợ xuất dữ liệu ra file Excel phục vụ kế toán đối soát.

---

## 9. Module Hệ Thống & Cài Đặt (`/admin/staff`, `roles`, `settings`, `notifications`)
- **Nhân viên & Phân quyền (RBAC):** Quản lý tài khoản nhân sự và phân bổ quyền hạn nghiêm ngặt (Super Admin, Quản lý kho, Thu ngân POS, Kế toán, CSKH).
- **Cài đặt cửa hàng:** Cấu hình tài khoản ngân hàng chuyển khoản VietQR, thuế VAT, bật/tắt in tự động và cho phép xuất âm kho.
- **Thông báo:** Nhận cảnh báo thời gian thực về đơn hàng mới, hàng sắp hết và công nợ đến hạn.
