const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reorganizeCatalog() {
  console.log('=== BẮT ĐẦU TÁI CẤU TRÚC DANH MỤC & SẢN PHẨM KHOA HỌC ===\n');

  // 1. ĐỊNH NGHĨA 6 DANH MỤC CHA CHUẨN
  const parentCategories = [
    {
      id: 'cat-cloud-vps',
      name: 'Cloud Server & VPS Quốc Tế',
      nameVi: 'Máy chủ ảo Cloud VPS tốc độ cao',
      slug: 'cloud-vps',
      description: 'Hạ tầng máy chủ ảo Cloud VPS cấu hình cao, băng thông không giới hạn từ DigitalOcean, AWS, Linode, Vultr...',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
      sortOrder: 1,
      isActive: true,
      partnerSource: 'local'
    },
    {
      id: 'cat-proxy-network',
      name: 'Proxy & Mạng Tốc Độ Cao',
      nameVi: 'Proxy 4G/5G, Dân cư & Xoay IP tốc độ cao',
      slug: 'proxy-ip',
      description: 'Proxy IPv4, IPv6 dân cư tĩnh và xoay tự động chất lượng cao, độ trễ thấp tối ưu cho MMO, Automation và nuôi tài khoản.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
      sortOrder: 2,
      isActive: true,
      partnerSource: 'local'
    },
    {
      id: 'cat-marketing-resources',
      name: 'Nguyên Liệu & Tài Khoản Quảng Cáo',
      nameVi: 'Via, BM, Clone, Instagram & Kênh truyền thông',
      slug: 'tai-khoan-quang-cao',
      description: 'Cung cấp tài khoản Via XMDT, BM kháng, Fanpage cổ, Clone cứng sẵn sàng chạy Ads ngân sách lớn.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80',
      sortOrder: 3,
      isActive: true,
      partnerSource: 'local'
    },
    {
      id: 'cat-mmo-services',
      name: 'Dịch Vụ Tăng Tương Tác & MMO',
      nameVi: 'Dịch vụ mạng xã hội, kéo nhóm Telegram, buff tương tác',
      slug: 'dich-vu-mmo',
      description: 'Hỗ trợ tăng thành viên nhóm Telegram, tăng mắt live, follow, like, comment đa nền tảng an toàn, hiệu quả.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
      sortOrder: 4,
      isActive: true,
      partnerSource: 'local'
    },
    {
      id: 'cat-software-accounts',
      name: 'Tài Khoản & Phần Mềm Bản Quyền',
      nameVi: 'Key bản quyền phần mềm, công cụ MMO tự động',
      slug: 'phan-mem-ban-quyen',
      description: 'Key bản quyền ứng dụng văn phòng, thiết kế đồ họa, giải trí đa phương tiện và bộ công cụ tự động hóa MMO.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80',
      sortOrder: 5,
      isActive: true,
      partnerSource: 'local'
    },
    {
      id: '1',
      name: 'Thiết Bị Tiện Ích Đời Sống',
      nameVi: 'Thiết bị gia dụng thông minh cao cấp',
      slug: 'tien-ich-gia-dung',
      description: 'Sản phẩm gia dụng hiện đại, thông minh nâng tầm tiện nghi không gian sống gia đình.',
      image: 'https://bizweb.dktcdn.net/100/422/614/collections/0d6a1de80ad2bef8d81671080e6aa03b.jpg?v=1617124222410',
      sortOrder: 6,
      isActive: true,
      partnerSource: 'local'
    }
  ];

  // Upsert 6 parent categories
  for (const parent of parentCategories) {
    await prisma.category.upsert({
      where: { id: parent.id },
      update: {
        name: parent.name,
        nameVi: parent.nameVi,
        slug: parent.slug,
        description: parent.description,
        image: parent.image,
        sortOrder: parent.sortOrder,
        isActive: true,
        parentId: null
      },
      create: {
        id: parent.id,
        name: parent.name,
        nameVi: parent.nameVi,
        slug: parent.slug,
        description: parent.description,
        image: parent.image,
        sortOrder: parent.sortOrder,
        isActive: true
      }
    });
    console.log(`✓ Parent Category: ${parent.name} (${parent.slug})`);
  }

  // 2. MAPPING SUB-CATEGORIES VỀ ĐÚNG PARENT VÀ CẬP NHẬT TÊN ĐẸP
  const subCategoryMappings = [
    // Cloud VPS Subcategories
    { id: 'tk-cat-17', name: 'VPS Chính Hãng Quốc Tế', slug: 'vps-chinh-hang-quoc-te', parentId: 'cat-cloud-vps', sortOrder: 1 },
    { id: 'tk-cat-4', name: 'DigitalOcean Droplets', slug: 'digitalocean-droplets', parentId: 'cat-cloud-vps', sortOrder: 2 },
    { id: 'tk-cat-5', name: 'AWS Cloud Services', slug: 'aws-cloud-services', parentId: 'cat-cloud-vps', sortOrder: 3 },
    { id: 'tk-cat-6', name: 'VPS Dùng Thử & Dev', slug: 'vps-dung-thu-dev', parentId: 'cat-cloud-vps', sortOrder: 4 },
    { id: 'tk-cat-16', name: 'Linode Cloud Compute', slug: 'linode-cloud-compute', parentId: 'cat-cloud-vps', sortOrder: 5 },
    { id: 'tk-cat-8', name: 'Vultr High Frequency', slug: 'vultr-high-frequency', parentId: 'cat-cloud-vps', sortOrder: 6 },
    { id: 'tk-cat-18', name: 'Kamatera Enterprise', slug: 'kamatera-enterprise', parentId: 'cat-cloud-vps', sortOrder: 7 },
    { id: 'tk-cat-2', name: 'Server & Dedicated', slug: 'server-dedicated', parentId: 'cat-cloud-vps', sortOrder: 8 },

    // Proxy Subcategories
    { id: 'hup-cat-proxy', name: 'Proxy 4G & Dân Cư Tốc Độ Cao', slug: 'proxy-4g-dan-cu', parentId: 'cat-proxy-network', sortOrder: 1 },
    { id: 'hup-cat-vip-proxy', name: 'Proxy Xoay VIP Game & MMO', slug: 'proxy-xoay-vip', parentId: 'cat-proxy-network', sortOrder: 2 },
    { id: 'tk-cat-23', name: 'Proxy Dedicated IP', slug: 'proxy-dedicated-ip', parentId: 'cat-proxy-network', sortOrder: 3 },

    // Marketing & Tài khoản Ads Subcategories
    { id: 'vv-cat-5', name: 'Tài Khoản Via & BM Kháng', slug: 'tai-khoan-via-khang', parentId: 'cat-marketing-resources', sortOrder: 1 },
    { id: 'vv-cat-6', name: 'Tài Khoản Clone Nuôi Sẵn', slug: 'tai-khoan-clone-nuoi', parentId: 'cat-marketing-resources', sortOrder: 2 },
    { id: 'vv-cat-7', name: 'Business Manager (BM)', slug: 'business-manager-bm', parentId: 'cat-marketing-resources', sortOrder: 3 },
    { id: 'vv-cat-23', name: 'Tài Khoản Quảng Cáo Cá Nhân', slug: 'tai-khoan-quang-cao-ca-nhan', parentId: 'cat-marketing-resources', sortOrder: 4 },
    { id: 'vv-cat-21', name: 'Tài Khoản Instagram Cổ', slug: 'tai-khoan-instagram-co', parentId: 'cat-marketing-resources', sortOrder: 5 },
    { id: 'vv-cat-22', name: 'Clone Instagram Đã Bật 2FA', slug: 'clone-instagram-2fa', parentId: 'cat-marketing-resources', sortOrder: 6 },
    { id: 'vv-cat-24', name: 'Kênh Livestream & Bán Hàng', slug: 'kenh-live-ban-hang', parentId: 'cat-marketing-resources', sortOrder: 7 },
    { id: 'vv-cat-19', name: 'Fanpage Cổ Lâu Năm', slug: 'fanpage-co-lau-nam', parentId: 'cat-marketing-resources', sortOrder: 8 },

    // MMO Services Subcategories
    { id: 'tcm-cat-buff', name: 'Dịch Vụ Tương Tác Đa Nền Tảng', slug: 'buff-tuong-tac-mxh', parentId: 'cat-mmo-services', sortOrder: 1 },
    { id: 'tcm-cat-member', name: 'Tăng Member & Kéo Nhóm', slug: 'tang-member-keo-nhom', parentId: 'cat-mmo-services', sortOrder: 2 },
    { id: 'tcm-cat-group', name: 'Cộng Đồng & Nhóm Xây Sẵn', slug: 'cong-dong-nhom-xay-san', parentId: 'cat-mmo-services', sortOrder: 3 },

    // Software & Tools Subcategories
    { id: 'tcm-cat-catalog', name: 'Phần Mềm & Công Cụ MMO Tự Động', slug: 'phan-mem-cong-cu-mmo', parentId: 'cat-software-accounts', sortOrder: 1 },
    { id: 'tp-cat-taikhoan', name: 'Tài Khoản Bản Quyền & Office', slug: 'tai-khoan-ban-quyen-office', parentId: 'cat-software-accounts', sortOrder: 2 },
    { id: 'tp-cat-dichvu', name: 'Dịch Vụ Số & Tiện Ích', slug: 'dich-vu-so-tien-ich', parentId: 'cat-software-accounts', sortOrder: 3 },

    // Gia dụng Subcategories
    { id: '2', name: 'Nồi Chiên Không Dầu', slug: 'noi-chien-khong-dau', parentId: '1', sortOrder: 1 },
    { id: '3', name: 'Bếp Từ & Bếp Hồng Ngoại', slug: 'bep-tu-bep-hong-ngoai', parentId: '1', sortOrder: 2 },
    { id: '4', name: 'Máy Xay Sinh Tố & Ép Chậm', slug: 'may-xay-ep-cham', parentId: '1', sortOrder: 3 },
    { id: '5', name: 'Máy Hút Bụi & Robot', slug: 'may-hut-bui-robot', parentId: '1', sortOrder: 4 },
    { id: '6', name: 'Máy Lọc Không Khí', slug: 'may-loc-khong-khi', parentId: '1', sortOrder: 5 },
    { id: '7', name: 'Quạt Điện & Điều Hòa Cây', slug: 'quat-dien-dieu-hoa', parentId: '1', sortOrder: 6 },
    { id: '8', name: 'Ấm Siêu Tốc & Bình Thủy', slug: 'am-sieu-toc-binh-thuy', parentId: '1', sortOrder: 7 }
  ];

  for (const sub of subCategoryMappings) {
    try {
      await prisma.category.update({
        where: { id: sub.id },
        data: {
          name: sub.name,
          nameVi: sub.name,
          slug: sub.slug,
          parentId: sub.parentId,
          sortOrder: sub.sortOrder,
          isActive: true
        }
      });
      console.log(`  ↳ Linked subcategory: [${sub.id}] ${sub.name} -> Parent: ${sub.parentId}`);
    } catch (e) {
      // If doesn't exist, ignore or log
      console.log(`  ↳ Note: Subcategory [${sub.id}] not found to update (${e.message})`);
    }
  }

  // 3. DI CHUYỂN CÁC SẢN PHẨM GIA DỤNG VỀ ĐÚNG DANH MỤC CON
  // Hiện tại 13 sản phẩm gia dụng đang nằm ở category '1'
  const homeAppliances = [
    { prefix: 'Nồi chiên không dầu', catId: '2' },
    { prefix: 'Bếp từ', catId: '3' },
    { prefix: 'Máy xay', catId: '4' },
    { prefix: 'Máy ép chậm', catId: '4' },
    { prefix: 'Máy hút bụi', catId: '5' },
    { prefix: 'Robot hút bụi', catId: '5' },
    { prefix: 'Máy lọc không khí', catId: '6' },
    { prefix: 'Quạt cây', catId: '7' },
    { prefix: 'Ấm siêu tốc', catId: '8' },
    { prefix: 'Bình thủy điện', catId: '8' }
  ];

  for (const ha of homeAppliances) {
    const updated = await prisma.product.updateMany({
      where: {
        name: { contains: ha.prefix }
      },
      data: {
        categoryId: ha.catId
      }
    });
    if (updated.count > 0) {
      console.log(`✓ Reassigned ${updated.count} home appliance products to Category [${ha.catId}]`);
    }
  }

  // 4. CHỌN VÀ ĐÁNH DẤU SẢN PHẨM NỔI BẬT (isFeatured), RATING, BADGE
  // Top items in each major category
  const featuredKeywords = [
    'DigitalOcean', 'AWS', 'Proxy', 'Via', 'BM', 'Telegram', 'Office', 'Canva', 'Robot', 'Inverter'
  ];

  for (const kw of featuredKeywords) {
    await prisma.product.updateMany({
      where: {
        name: { contains: kw },
        status: 'ACTIVE'
      },
      data: {
        isFeatured: true,
        rating: 5.0,
        badge: 'BÁN CHẠY'
      }
    });
  }

  console.log('✓ Updated featured badges and ratings.');

  // 5. KIỂM TRA PHÂN PHỐI SẢN PHẨM THEO DANH MỤC CHA
  const allParents = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: {
        include: {
          _count: { select: { products: true } }
        }
      },
      _count: { select: { products: true } }
    },
    orderBy: { sortOrder: 'asc' }
  });

  console.log('\n=== KẾT QUẢ PHÂN BỔ DANH MỤC SAU TÁI CẤU TRÚC ===');
  for (const p of allParents) {
    const directCount = p._count.products;
    const subCount = p.children.reduce((acc, c) => acc + c._count.products, 0);
    const totalInTree = directCount + subCount;
    console.log(`\n📂 [${p.id}] ${p.name} (slug: ${p.slug})`);
    console.log(`   Tổng sản phẩm: ${totalInTree} (Trực tiếp: ${directCount}, Từ ${p.children.length} danh mục con: ${subCount})`);
    for (const c of p.children) {
      console.log(`      ↳ [${c.id}] ${c.name} (${c.slug}): ${c._count.products} sp`);
    }
  }

  console.log('\n=== HOÀN TẤT TÁI CẤU TRÚC DANH MỤC THÀNH CÔNG ===');
}

reorganizeCatalog().catch(console.error).finally(() => prisma.$disconnect());
