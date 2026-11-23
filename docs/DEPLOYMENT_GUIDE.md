# Hướng Dẫn Triển Khai Full-Stack (Deployment Guide)

Hệ thống **Nền tảng Aggregator Sản phẩm Số & Dịch vụ Đa Nhà Cung Cấp** được xây dựng trên nền tảng **Next.js 15 App Router + TypeScript + Prisma ORM + TailwindCSS**. 

Hệ thống hỗ trợ 100% chế độ **Standalone**, có thể triển khai linh hoạt lên bất kỳ hạ tầng nào: **Docker/VPS**, **Vercel**, **Railway**, **Render**, hoặc **Netlify**.

---

## 1. Cấu Hình Biến Môi Trường (Environment Variables)

Chuẩn bị file `.env` hoặc cấu hình trên Dashboard hosting:

```env
# Application
NODE_ENV=production
PORT=3000
APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-32-character-secret-key
CRON_SECRET=your-cron-secret-token

# Database (PostgreSQL qua Supabase hoặc Supavisor Pooler port 6543)
DATABASE_URL="postgres://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Upstream Providers API Keys
THAPCAMMMO_API_KEY=fag_QP1koV6eCa-PP4f0ICZ_7WgUUmQmTjxd
HUPSMS_API_KEY=hup_diU_B9nHS0KxWqKcYV7sBbdpoWgnV9y2TXnMTXgVOgBfRcMm
VUAVIA_API_KEY=your_vuavia_key
TAIKHOAN_API_KEY=your_taikhoan_key
THANHPLUS_API_KEY=your_thanhplus_key

# Supabase Auth / Storage (Nếu dùng)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 2. Phương Án 1: Triển Khai Bằng Docker (Khuyến nghị cho VPS / Server riêng)

Với chế độ `output: 'standalone'` trong `next.config.js`, image Docker được tối ưu siêu nhẹ (~120MB), khởi động tức thì và tiết kiệm RAM tối đa.

### Khởi chạy với Docker Compose (1 câu lệnh)
```bash
docker compose up -d --build
```
Ứng dụng sẽ tự động khởi chạy và lắng nghe trên cổng `3000`.

### Kiểm tra trạng thái:
```bash
docker compose ps
docker compose logs -f web
```

---

## 3. Phương Án 2: Triển Khai Lên Vercel (Miễn phí & Tối ưu Serverless)

Hệ thống đã có file `vercel.json` định dạng sẵn khu vực Đông Nam Á (`sin1` Singapore).

### Cách 1: Kết nối GitHub Repo (Khuyến nghị)
1. Push mã nguồn lên GitHub/GitLab.
2. Truy cập [vercel.com](https://vercel.com) -> New Project -> Import Repository.
3. Điền các biến môi trường trong mục **Environment Variables**.
4. Nhấn **Deploy**.

### Cách 2: Deploy trực tiếp bằng Vercel CLI
```bash
npx vercel --prod
```

---

## 4. Phương Án 3: Triển Khai Lên Netlify (Qua Git Integration)

Do tài khoản Netlify CLI có thể bị giới hạn hạn ngạch deploy trực tiếp từ terminal (`Account credit usage exceeded`), phương pháp triển khai chuẩn là **kết nối qua Git**:

1. Push mã nguồn lên GitHub.
2. Vào **Netlify Dashboard** -> **Add new site** -> **Import an existing project**.
3. Chọn repo GitHub của bạn.
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Nhập các biến môi trường và ấn **Deploy Site**. Các lần push code sau Netlify sẽ tự động build.

---

## 5. Phương Án 4: Triển Khai Lên Railway / Render / Fly.io

Các nền tảng này tự động nhận diện `Dockerfile` trong thư mục gốc:
- **Railway**: New Project -> Deploy from GitHub repo -> Railway tự nhận diện Dockerfile và deploy.
- **Render**: New Web Service -> Connect Git -> Environment: Docker.

---

## 6. Khởi Tạo Cơ Sở Dữ Liệu Lần Đầu (Database Migration & Seeding)

Sau khi deploy lên môi trường Production có kết nối PostgreSQL:
```bash
# Đẩy schema lên database
npx prisma db push

# Khởi tạo dữ liệu danh mục & nhà cung cấp ban đầu
npx prisma db seed
# hoặc chạy script đồng bộ:
node scripts/syncStoreData.js
```

---

## 7. Quản Trị Nhà Cung Cấp Trong Admin Panel

Hệ thống đã chuẩn hóa toàn bộ 6 nguồn cung cấp:
- **Admin Dashboard**: `/admin/dashboard` - Theo dõi sức khỏe, độ trễ ping và trạng thái của 6 nhà cung cấp.
- **Quản lý Cổng Cung Cấp**: `/admin/providers` - Bật/tắt kết nối, test ping, đồng bộ số dư ví nhà cung cấp.
- **Danh sách Sản Phẩm & Bộ Lọc Nguồn**: `/admin/products` - Lọc sản phẩm theo từng nhà cung cấp (`HupSMS`, `VuaVia`, `ThapCamMMO`, `TaiKhoan`, `ThanhPlus`, `Kho Nội Bộ`).
