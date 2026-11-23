# BETASHOP E-COMMERCE & ADMIN ENTERPRISE SYSTEM
### Tổng Kho Đồ Gia Dụng Việt Nam – Kiến Trúc Đa Kênh (Online & POS) – Zero PHP

---

## 1. Giới Thiệu Dự Án
Betashop là nền tảng thương mại điện tử chuyên ngành tổng kho đồ gia dụng (nồi chiên không dầu, bếp từ, robot hút bụi, máy lọc nước, đồ gia dụng nhà bếp...), kết hợp đồng bộ giữa **Cổng bán hàng trực tuyến (Storefront)** và **Hệ thống quản trị doanh nghiệp (Admin Panel Enterprise)**:
- **100% Không dùng PHP:** Chạy hoàn toàn trên **Next.js 14/15 App Router**, **TypeScript** và **Node.js Runtime**.
- **Đa Chi Nhánh & Đa Kho:** Kho Tổng Hà Nội (Mỹ Đình) và Kho Chi Nhánh TP.HCM (Tân Bình).
- **Đa Kênh Bán Hàng (Omnichannel):** Đồng bộ bán hàng qua Website, App và Quầy thu ngân **POS Terminal**.
- **Tối ưu cPanel & VPS nhẹ:** Cấu hình `output: 'standalone'` giúp toàn bộ gói deploy chỉ nặng **~18.5 MB**, hoạt động mượt mà trên cPanel (Node.js App) hoặc VPS chỉ từ 1–2 GB RAM.
- **Bản địa hóa 100% Tiếng Việt:** Định dạng tiền tệ VND (`1.234.567 ₫`), định dạng ngày giờ `dd/MM/yyyy HH:mm`, tích hợp ngân hàng VietQR 24/7 và xác thực số điện thoại di động Việt Nam.

---

## 2. Kiến Trúc Công Nghệ & Database
- **Frontend & Admin:** Next.js (App Router), React 18, TypeScript Strict Mode.
- **Styling:** Tailwind CSS, shadcn/ui layout, Lucide Icons, React Icons.
- **Biểu đồ & Báo cáo:** Recharts (AreaChart, BarChart, PieChart).
- **Xuất dữ liệu:** Thư viện `xlsx` (Excel Export).
- **ORM & Database:**
  - Prisma ORM với lược đồ dữ liệu `prisma/schema.prisma` đầy đủ hơn 30 models (User, Role, Warehouse, Supplier, Product, ProductVariant, Stock, StockMovement, ImportVoucher, ExportVoucher, TransferVoucher, Adjustment, Order, Return, Customer, Coupon, Review, Setting).
  - Tích hợp lớp dữ liệu `lib/adminDb.ts` và `lib/dbService.ts` tự động seed và đồng bộ vào `data/database.json`, chạy ngay lập tức không cần cài đặt server database riêng trên shared hosting.

---

## 3. Tài Khoản Quản Trị Mặc Định (Seed Data)
| Tài khoản | Mật khẩu | Vai trò | Quyền hạn |
|---|---|---|---|
| `admin@example.com` | `Admin@123` | **Super Admin** | Toàn quyền cấu hình, tài chính, báo cáo và quản trị hệ thống |
| `admin@gmail.com` | `12345678` | **Super Admin** | Toàn quyền kiểm thử nhanh |
| `kho.hn@betashop.vn` | `Admin@123` | **Quản lý kho** | Quản lý xuất/nhập/chuyển kho, kiểm kê và nhà cung cấp |
| `pos.mydinh@betashop.vn` | `Admin@123` | **Thu ngân POS** | Bán hàng tại quầy, quét barcode và in hóa đơn nhiệt |

---

## 4. Cấu Trúc Thư Mục Admin Panel (`/app/admin`)
```text
/app/admin
  ├── layout.tsx                # Khung giao diện Admin: Sidebar thu gọn, Topbar đa kho, chuông thông báo
  ├── page.tsx                  # Điều hướng chính vào Dashboard
  ├── dashboard/page.tsx        # Bảng điều khiển KPI: Doanh thu 30 ngày, top bán chạy, cảnh báo tồn kho, đơn mới
  ├── products/
  │   ├── page.tsx              # Quản lý sản phẩm gia dụng (CRUD, lọc, tìm kiếm, xuất Excel)
  │   ├── [id]/page.tsx         # Thêm/sửa chi tiết sản phẩm: barcode, thông số W/L/V, đa mức giá, tồn kho
  │   └── variants/page.tsx     # Ma trận biến thể quy cách (dung tích, công suất, điện áp)
  ├── categories/page.tsx       # Danh mục hàng hóa phân cấp (Parent-Child)
  ├── brands/page.tsx           # Thương hiệu đối tác & xuất xứ (Philips, Sunhouse, Cuckoo...)
  ├── suppliers/page.tsx        # Nhà cung cấp, lịch sử nhập hàng và theo dõi công nợ phải trả
  ├── warehouses/page.tsx       # Quản lý đa kho hàng, sức chứa và thủ kho phụ trách
  ├── inventory/                # MODULE TRỌNG TÂM: QUẢN LÝ KHO
  │   ├── stock/page.tsx        # Tồn kho thực tế, đang giữ, sẵn sàng bán và cảnh báo định mức
  │   ├── imports/page.tsx      # Phiếu nhập kho từ NCC, in phiếu A4, tự động cộng kho & ghi công nợ
  │   ├── exports/page.tsx      # Phiếu xuất kho thủ công (xuất mẫu, hủy lỗi, trả NCC)
  │   ├── transfers/page.tsx    # Điều chuyển kho nội bộ 2 bước (Hà Nội <-> TP.HCM)
  │   ├── adjustments/page.tsx  # Cân bằng kiểm kê định kỳ (soát số sách vs thực tế)
  │   └── history/page.tsx      # Sổ nhật ký biến động kho (Audit Trail)
  ├── orders/
  │   ├── page.tsx              # Quản lý đơn hàng đa kênh theo tab tiến trình
  │   ├── [id]/page.tsx         # Chi tiết đơn hàng, timeline trạng thái, in hóa đơn A4/A5
  │   ├── pos/page.tsx          # MÀN HÌNH BÁN HÀNG TẠI QUẦY: Quét barcode, tính tiền thừa, in nhiệt K80
  │   └── returns/page.tsx      # Phiếu đổi trả hàng, nhập lại kho bán được hoặc chuyển kho hỏng
  ├── customers/page.tsx        # CRM khách hàng, phân hạng VIP/Thân thiết, tích điểm, tổng chi tiêu
  ├── coupons/page.tsx          # Quản lý mã giảm giá voucher (% hoặc tiền cố định)
  ├── promotions/page.tsx       # Chương trình khuyến mãi Flash Sale, Combo tiết kiệm
  ├── shipping/page.tsx         # Cấu hình phí ship theo tỉnh thành và ngưỡng miễn phí vận chuyển
  ├── reviews/page.tsx          # Kiểm duyệt và phản hồi đánh giá của khách hàng
  ├── reports/
  │   ├── revenue/page.tsx      # Báo cáo doanh thu, giá vốn hàng bán (COGS) và lợi nhuận gộp
  │   ├── inventory/page.tsx    # Báo cáo định giá vốn lưu động tồn kho
  │   ├── products/page.tsx     # Báo cáo sản phẩm bán chạy nhất
  │   └── customers/page.tsx    # Báo cáo phân khúc khách hàng
  ├── staff/page.tsx            # Danh sách nhân viên và chi nhánh trực thuộc
  ├── roles/page.tsx            # Phân quyền vai trò chi tiết (RBAC)
  ├── settings/page.tsx         # Cài đặt doanh nghiệp, tài khoản VietQR, thuế VAT, in hóa đơn
  └── notifications/page.tsx    # Trung tâm thông báo hệ thống và cảnh báo tồn kho
```

---

## 5. Hướng Dẫn Cài Đặt & Triển Khai

### 5.1. Chạy môi trường Local Development
```powershell
# Cài đặt dependencies
npm install

# Khởi chạy server phát triển
npm run dev
```
- Storefront: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Màn hình POS Thu ngân: `http://localhost:3000/admin/orders/pos`

### 5.2. Build gói Standalone
```powershell
npm run build
```
Next.js sẽ biên dịch tối ưu hóa và xuất gói standalone tại `.next/standalone`.

### 5.3. Triển khai lên cPanel Shared Hosting (Node.js App)
1. Đăng nhập vào cPanel &rarr; mở **Setup Node.js App**.
2. Chọn **Create Application**:
   - Node.js Version: `18.x`, `20.x` hoặc `22.x`.
   - Application root: `betashop` (hoặc thư mục tương ứng).
   - Application startup file: `server.js`.
3. Upload và giải nén các thư mục sau vào thư mục ứng dụng trên host:
   - Thư mục `.next/standalone/` (toàn bộ nội dung bên trong).
   - Thư mục `.next/static/` copy vào `.next/standalone/.next/static/`.
   - Thư mục `public/` copy vào `.next/standalone/public/`.
   - Thư mục `data/` copy vào `.next/standalone/data/`.
4. Nhấn **Restart Application** trong cPanel để khởi chạy.

### 5.4. Triển khai lên VPS Linux (Ubuntu / Debian qua PM2 & Nginx)
```bash
# Cài đặt PM2
npm install -g pm2

# Khởi chạy với PM2
pm2 start server.js --name "betashop-web" -i max

# Lưu cấu hình khởi động cùng hệ thống
pm2 save
pm2 startup
```

---

## 6. Quy Trình Vận Hành Mẫu (Workflow Demonstration)
1. **Nhập hàng từ NCC:** Truy cập `/admin/inventory/imports` &rarr; Chọn NCC Elmich &rarr; Nhập 50 nồi chiên &rarr; Hệ thống tự động cộng tồn kho Kho Hà Nội và ghi nhận công nợ.
2. **Khách đặt hàng Online:** Khách chọn sản phẩm tại `/san-pham` &rarr; Đặt qua `/thanh-toan` &rarr; Đơn hàng xuất hiện tại `/admin/orders` ở trạng thái "Chờ xác nhận" &rarr; Chuông thông báo kích hoạt.
3. **Bán hàng tại quầy POS:** Thu ngân mở `/admin/orders/pos` &rarr; Quét mã Barcode &rarr; Nhập tiền khách đưa &rarr; Bấm thanh toán &rarr; Tự động in hóa đơn nhiệt K80 và trừ tồn kho ngay lập tức.
4. **Kiểm kê định kỳ:** Truy cập `/admin/inventory/adjustments` &rarr; Nhập số thực tế đếm được &rarr; Hệ thống tính toán chênh lệch thừa/thiếu và cân bằng sổ sách.
5. **Theo dõi tài chính:** Truy cập `/admin/reports/revenue` &rarr; Xem biểu đồ lợi nhuận gộp và xuất file Excel đối soát.
