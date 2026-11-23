import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- KHỞI TẠO VÀ ĐỒNG BỘ DỮ LIỆU THỰC TẾ LÊN SUPABASE POSTGRESQL ---');

  const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'database.json'), 'utf8');
  const db = JSON.parse(raw);

  // 1. Roles
  console.log('1. Đang đồng bộ Roles...');
  for (const r of db.roles || []) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name, description: r.description },
      create: { id: r.id, name: r.name, code: r.code, description: r.description },
    });
  }

  // 2. Warehouses
  console.log('2. Đang đồng bộ Kho hàng (Warehouses)...');
  for (const w of db.warehouses || []) {
    await prisma.warehouse.upsert({
      where: { code: w.code },
      update: { name: w.name, address: w.address, phone: w.phone, managerName: w.managerName, isDefault: w.isDefault || false },
      create: { id: w.id, code: w.code, name: w.name, address: w.address, phone: w.phone, managerName: w.managerName, isDefault: w.isDefault || false },
    });
  }

  // 3. Suppliers
  console.log('3. Đang đồng bộ Nhà cung cấp (Suppliers)...');
  for (const s of db.suppliers || []) {
    await prisma.supplier.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        phone: s.phone,
        email: s.email,
        address: s.address,
        taxCode: s.taxCode,
        contactPerson: s.contactPerson,
        totalImport: s.totalImport || 0,
        totalPaid: s.totalPaid || 0,
        balanceDue: s.balanceDue || 0,
        rating: s.rating || 5.0,
        note: s.note,
      },
      create: {
        id: s.id,
        code: s.code,
        name: s.name,
        phone: s.phone,
        email: s.email,
        address: s.address,
        taxCode: s.taxCode,
        contactPerson: s.contactPerson,
        totalImport: s.totalImport || 0,
        totalPaid: s.totalPaid || 0,
        balanceDue: s.balanceDue || 0,
        rating: s.rating || 5.0,
        note: s.note,
      },
    });
  }

  // 4. Categories
  console.log('4. Đang đồng bộ Danh mục sản phẩm (Categories)...');
  for (const c of db.categories || []) {
    const slug = c.slug || `cat-${c.id}`;
    await prisma.category.upsert({
      where: { slug },
      update: { name: c.name || c.title, nameVi: c.nameVi || c.title || c.name, image: c.image, sortOrder: c.sortOrder || 0 },
      create: {
        id: String(c.id),
        name: c.name || c.title,
        nameVi: c.nameVi || c.title || c.name,
        slug,
        description: c.description,
        image: c.image,
        sortOrder: c.sortOrder || 0,
      },
    });
  }

  // 5. Brands
  console.log('5. Đang đồng bộ Thương hiệu (Brands)...');
  for (const b of db.brands || []) {
    const bName = typeof b === 'string' ? b : b.name;
    const bSlug = (typeof b === 'string' ? b.toLowerCase().replace(/\s+/g, '-') : b.slug) || `brand-${Date.now()}`;
    await prisma.brand.upsert({
      where: { name: bName },
      update: { slug: bSlug },
      create: {
        id: typeof b === 'object' && b.id ? String(b.id) : `brd-${bSlug}`,
        name: bName,
        slug: bSlug,
        country: typeof b === 'object' ? b.country : 'Việt Nam',
        logo: typeof b === 'object' ? b.logo : null,
        description: typeof b === 'object' ? b.description : null,
      },
    });
  }

  // 6. Users (Staff)
  console.log('6. Đang đồng bộ Nhân viên quản trị (Staff Users)...');
  for (const u of db.users || []) {
    const role = await prisma.role.findFirst({ where: { code: u.roleCode || 'SUPER_ADMIN' } });
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, phone: u.phone, avatar: u.avatar, roleId: role?.id, isActive: u.isActive ?? true },
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        avatar: u.avatar,
        passwordHash: u.passwordHash || '$argon2id$v=19$m=65536,t=3,p=4$demo$123456',
        roleId: role?.id,
        warehouseId: u.warehouseId,
        isActive: u.isActive ?? true,
      },
    });
  }

  // 7. Products
  console.log('7. Đang đồng bộ Sản phẩm gia dụng (Products)...');
  const defaultCategory = await prisma.category.findFirst();
  const defaultBrand = await prisma.brand.findFirst();

  for (const p of db.products || []) {
    const pSlug = p.slug || `san-pham-${p.id}`;
    const pSku = p.sku || `SKU-${p.id}`;
    const catId = p.categoryId && (await prisma.category.findUnique({ where: { id: String(p.categoryId) } }))
      ? String(p.categoryId)
      : defaultCategory?.id;

    if (!catId) continue;

    const brand = p.brand ? await prisma.brand.findFirst({ where: { name: p.brand } }) : defaultBrand;

    await prisma.product.upsert({
      where: { slug: pSlug },
      update: {
        name: p.name || p.title,
        retailPrice: p.price || p.retailPrice || 0,
        salePrice: p.salePrice || p.originalPrice,
        thumbnail: p.image || p.thumbnail,
        unit: p.unit || 'Chiếc',
        status: p.status || 'ACTIVE',
      },
      create: {
        id: String(p.id),
        name: p.name || p.title,
        slug: pSlug,
        sku: pSku,
        barcode: p.barcode || pSku,
        shortDesc: p.shortDesc || p.subtitle,
        description: p.description,
        unit: p.unit || 'Chiếc',
        categoryId: catId,
        brandId: brand?.id,
        thumbnail: p.image || p.thumbnail,
        costPrice: p.costPrice || Math.round((p.price || p.retailPrice || 100000) * 0.7),
        retailPrice: p.price || p.retailPrice || 0,
        salePrice: p.salePrice || p.originalPrice,
        warrantyMonths: p.warrantyMonths || 12,
        soldCount: p.soldCount || 10,
        rating: p.rating || 5.0,
        isFeatured: p.isFeatured ?? true,
        status: p.status || 'ACTIVE',
      },
    });
  }

  // 8. Coupons
  console.log('8. Đang đồng bộ Mã giảm giá (Coupons)...');
  for (const cp of db.coupons || []) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {
        type: cp.type || 'PERCENT',
        value: cp.value || cp.discountValue || 10,
        minOrder: cp.minOrder || cp.minOrderValue || 0,
        usageLimit: cp.usageLimit || 100,
        usedCount: cp.usedCount || 0,
        isActive: cp.isActive ?? true,
      },
      create: {
        id: cp.id,
        code: cp.code,
        type: cp.type || 'PERCENT',
        value: cp.value || cp.discountValue || 10,
        minOrder: cp.minOrder || cp.minOrderValue || 0,
        usageLimit: cp.usageLimit || 100,
        usedCount: cp.usedCount || 0,
        isActive: cp.isActive ?? true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 3600 * 1000),
      },
    });
  }

  console.log('✅ ĐỒNG BỘ DỮ LIỆU THỰC TẾ LÊN SUPABASE POSTGRES HOÀN TẤT THÀNH CÔNG!');
}

main()
  .catch((e) => {
    console.error('Lỗi seed Supabase:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
