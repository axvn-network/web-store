import fs from 'fs';
import path from 'path';
import { readAdminDb, writeAdminDb } from '../lib/adminDb';

async function main() {
  console.log('--- ĐỒNG BỘ CƠ SỞ DỮ LIỆU TỔNG KHO GIA DỤNG BETASHOP ---');
  const db = readAdminDb();

  console.log(`✓ Người dùng & nhân viên: ${db.users.length}`);
  console.log(`✓ Phân quyền (Roles): ${db.roles.length}`);
  console.log(`✓ Kho hàng: ${db.warehouses.length}`);
  console.log(`✓ Nhà cung cấp: ${db.suppliers.length}`);
  console.log(`✓ Sản phẩm gia dụng: ${db.products.length}`);
  console.log(`✓ Biến thể SKU: ${db.variants.length}`);
  console.log(`✓ Bản ghi tồn kho chi nhánh: ${db.stocks.length}`);
  console.log(`✓ Lịch sử biến động kho: ${db.stockMovements.length}`);
  console.log(`✓ Phiếu nhập kho (PNK): ${db.importVouchers.length}`);
  console.log(`✓ Phiếu xuất kho (PXK): ${db.exportVouchers.length}`);
  console.log(`✓ Phiếu chuyển kho (PCK): ${db.transferVouchers.length}`);
  console.log(`✓ Phiếu kiểm kê (PKK): ${db.adjustments.length}`);
  console.log(`✓ Phiếu hoàn trả (PTH): ${db.returns.length}`);
  console.log(`✓ Đơn hàng online & POS: ${db.orders.length}`);
  console.log(`✓ Khách hàng & đối tác: ${db.customers.length}`);
  console.log(`✓ Mã giảm giá (Coupons): ${db.coupons.length}`);
  console.log(`✓ Chương trình khuyến mãi: ${db.promotions.length}`);
  console.log(`✓ Cấu hình vận chuyển: ${db.shippingZones.length}`);
  console.log(`✓ Đánh giá phản hồi: ${db.reviews.length}`);
  console.log(`✓ Thông báo hệ thống: ${db.notifications.length}`);
  console.log(`✓ Nhật ký hoạt động: ${db.activities.length}`);

  writeAdminDb(db);
  const dbPath = path.join(process.cwd(), 'data', 'database.json');
  const stats = fs.statSync(dbPath);
  console.log(`\n🎉 Đã lưu thành công ${stats.size.toLocaleString('vi-VN')} bytes vào ${dbPath}`);
}

main().catch(console.error);
