# TÀI LIỆU YÊU CẦU KỸ THUẬT & HƯỚNG DẪN VẬN HÀNH TỰ ĐỘNG HÓA
## Nền tảng Aggregator Sản Phẩm Số & Dịch Vụ Công Nghệ Đa Nhà Cung Cấp
> Phiên bản: 2.0 (Automation-First Edition) — Ngày: 2026-11-21  
> Stack: Next.js 15 (App Router) + TypeScript Strict + Supabase (PostgreSQL / RLS / Storage) + Netlify Serverless  
> Chi phí hạ tầng vận hành: **~0 đồng/tháng** (Gói Free Supabase + Netlify Scheduled Functions)

---

### PHẦN 1. TRIẾT LÝ VẬN HÀNH TỰ ĐỘNG HÓA (AUTOMATION-FIRST)
1. **Automate the predictable** — Mọi quy trình có logic rõ ràng đều chạy tự động 24/7 (Fulfill, Failover, Auto-refund, Đồng bộ giá, Check health).
2. **Escalate the exceptional** — Chỉ thông báo cho admin khi vượt ngưỡng rủi ro hoặc có tranh chấp gian lận.
3. **Self-healing trước, báo động sau** — Hệ thống tự phục hồi lỗi tạm thời (retry exponential backoff, circuit-breaker, chuyển route) trước khi thông báo.
4. **Mục tiêu đo lường**: Tỷ lệ đơn hàng hoàn tất tự động (**Zero-Touch Rate**) đạt **≥ 90%** (hiển thị trực tiếp tại Dashboard Quản trị).

---

### PHẦN 2. 6 LỚP TỰ ĐỘNG HÓA CỐT LÕI

#### Lớp 1: Tự động hóa Fulfill & Định tuyến Thông minh (`lib/fulfillmentRouter.ts`, `lib/queue.ts`)
- **Smart Failover Chain**: Khi gọi provider A bị timeout (> 8s) hoặc lỗi HTTP 5xx, router lập tức chuyển đổi sang provider B có độ ưu tiên kế tiếp ngay trong cùng yêu cầu.
- **Circuit Breaker Pattern**: Nếu provider gặp lỗi > 50% trong 10 phút, hệ thống tự động "ngắt mạch" 15 phút, bỏ qua provider đó để tránh nghẽn luồng khách hàng. Khi phục hồi 2 lần liên tiếp sẽ tự động đưa về `ACTIVE`.
- **Hàng đợi Serverless (Queue Engine)**: Hoạt động theo mô hình pg-boss trên Supabase Postgres kết hợp **Netlify Scheduled Functions** (`/api/cron/worker` chạy mỗi phút). Mỗi job được bảo vệ bằng `singletonKey` chống xử lý trùng lặp (idempotency).

#### Lớp 2: Tự động Hoàn tiền Đơn lỗi (`lib/automationEngine.ts`)
- Khi đơn hàng thất bại sau tối đa 5 lần retry:
  - Nếu giá trị đơn hàng **≤ 200.000 ₫** (ngưỡng cấu hình): Hệ thống tự động hoàn tiền 100% về ví khách (`WalletService.adjustBalanceAtomic`), chuyển trạng thái đơn sang `RETURNED`, gửi email xin lỗi tự động và ghi nhận nhật ký `AutomationLog`.
  - Nếu giá trị đơn hàng **> 200.000 ₫**: Hệ thống chuyển sang trạng thái chờ duyệt thủ công và gửi cảnh báo có nút hành động tới admin.

#### Lớp 3: Tự động Quản lý Biến động Giá Vốn Upstream (`lib/automationEngine.ts`)
- Khi API nhà cung cấp thay đổi giá vốn (`costPrice`):
  - Giá vốn **giảm**: Tự động tính lại giá bán lẻ có lợi cho khách hàng và ghi nhận `PriceChangeLog` trạng thái `AUTO_APPLIED`.
  - Giá vốn **tăng ≤ 10%**: Tự động cập nhật giá bán lẻ theo tỷ lệ markup.
  - Giá vốn **tăng > 10%**: Giữ nguyên giá cũ, đưa vào danh sách chờ admin duyệt (`PENDING_ADMIN_APPROVAL`) và cảnh báo qua Telegram.

#### Lớp 4: Tự động Cảnh báo Tồn kho & Cooldown 24h (`lib/stockManager.ts`, `lib/escalationHub.ts`)
- Đối với sản phẩm bán key nội bộ: khi tồn kho < 1.5× `minStockAlert`, gửi cảnh báo yêu cầu nhập thêm lô hàng (Batch).
- Áp dụng **cooldown 24h** giữa 2 lần cảnh báo của cùng một sản phẩm để tránh spam.

#### Lớp 5: Trung tâm Điều hướng Cảnh báo & Gộp nhóm (`lib/escalationHub.ts`)
- Gộp các lỗi cùng nhóm phát sinh trong vòng 30 phút thành **1 thông báo tổng hợp duy nhất** (ví dụ: 20 đơn fail cùng lúc chỉ gửi 1 thông báo gộp, không gửi 20 tin).
- Giới hạn cứng: **≤ 10 thông báo/ngày** cho admin.
- Mọi cảnh báo Telegram đều kèm **nút liên kết hành động nhanh** (Quick Action Buttons).

#### Lớp 6: Keep-Alive Duy trì Supabase 0đ (`app/api/cron/keep-alive/route.ts`, `.github/workflows/keep-alive.yml`)
- Tự động thực hiện truy vấn nhẹ vào database mỗi ngày 2 lần qua GitHub Actions để Supabase không bao giờ rơi vào trạng thái tạm dừng (auto-pause sau 7 ngày trên gói Free).

---

### PHẦN 3. BẢO MẬT & MÃ HÓA
- **AES-256-GCM**: Toàn bộ API key của 5 nhà cung cấp (HupSMS, TaiKhoan, VuaVia, ThanhPlus, ThapCamMMO) và key/account trong kho đều được mã hóa bằng AES-256-GCM trước khi lưu DB.
- **SHA-256 Hash**: Mỗi payload key được băm SHA-256 để kiểm tra tính duy nhất (`payloadHash UNIQUE`), từ chối ngay lập tức nếu admin nạp key trùng lặp.
- **Atomic Stock Allocation**: Sử dụng transaction với khóa hàng (`SELECT ... FOR UPDATE`), bảo đảm 2 khách hàng bấm mua cùng 1 phần nghìn giây không bao giờ bị nhận trùng key.

---

### PHẦN 4. HƯỚNG DẪN TRUY CẬP CÁC TRANG QUẢN TRỊ MỚI
1. **Trung tâm Tự động hóa (`/admin/automation`)**:
   - Theo dõi chỉ số **Zero-Touch Rate (%)**.
   - Trình chỉnh sửa quy tắc (Rule Editor) điều chỉnh ngưỡng hoàn tiền, ngưỡng biến động giá và cooldown.
   - Dòng thời gian quyết định tự động (Decision Timeline) theo thời gian thực.
2. **Quản lý Nhà cung cấp & Kiểm tra API (`/admin/providers`)**:
   - Bảng theo dõi sức khỏe và đo độ trễ API live.
   - Quản lý khóa API được che phủ (`****abcd`).
3. **Kho Key & Tài khoản Số (`/admin/stock`)**:
   - Hộp thoại nhập key hàng loạt (Bulk Import) tự động mã hóa AES-256-GCM.

---

### PHẦN 5. KẾT QUẢ KIỂM THỬ TỰ ĐỘNG HÓA TOÀN BỘ HỆ THỐNG
```text
===============================================================
                     TEST EXECUTION SUMMARY                    
===============================================================
  Tier 1 (Feature Coverage)      : 48/48 passed
  Tier 2 (Boundary & Corner)     : 25/25 passed
  Tier 3 (Combinations)          : 8/8 passed
  Tier 4 (Real-World Scenarios)  : 5/5 passed
---------------------------------------------------------------
  TOTAL: 86/86 passed (0 failed) in 33571ms
===============================================================
```
Hệ thống sẵn sàng vận hành thương mại với độ ổn định và tính tự động hóa cao nhất.
