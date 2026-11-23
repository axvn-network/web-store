const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://iiibvihzfnyncrwcdvyt.supabase.co';
const supabaseSecretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Partner configs
const TAIKHOAN_BASE_URL = process.env.TAIKHOAN_BASE_URL || 'https://taikhoan.site';
const TAIKHOAN_API_KEY = process.env.TAIKHOAN_API_KEY || '';

const VUAVIA_BASE_URL = process.env.VUAVIA_BASE_URL || 'https://api.vuavia.io/api/v2';
const VUAVIA_API_KEY = process.env.VUAVIA_API_KEY || '';

const HUPSMS_BASE_URL = process.env.HUPSMS_BASE_URL || 'https://hupsms.com/api/v1';
const HUPSMS_API_KEY = process.env.HUPSMS_API_KEY || '';

const THANHPLUS_BASE_URL = process.env.THANHPLUS_BASE_URL || 'https://thanhplus.vn';
const THANHPLUS_API_KEY = process.env.THANHPLUS_API_KEY || '';

const THAPCAMMMO_BASE_URL = 'https://api.thapcammmo.vn';
const THAPCAMMMO_API_KEY = 'fag_QP1koV6eCa-PP4f0ICZ_7WgUUmQmTjxd';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
};

function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/taikhoan\.site/gi, 'BetaShop')
    .replace(/vuavia\.io/gi, 'BetaShop')
    .replace(/hupsms\.com/gi, 'BetaShop')
    .replace(/thanhplus\.vn/gi, 'BetaShop')
    .replace(/thapcammmo\.vn/gi, 'BetaShop')
    .replace(/ThapCamMMO/gi, 'BetaShop')
    .replace(/đồng bộ từ [^.]+[\s.]*/gi, 'chính hãng tại BetaShop. ')
    .replace(/kích hoạt tự động qua API [^.]*\./gi, 'Kích hoạt tự động 24/7 qua hệ thống BetaShop.')
    .replace(/qua API [a-zA-Z0-9_.-]+/gi, 'qua hệ thống BetaShop')
    .replace(/qua hệ thống API/gi, 'qua hệ thống BetaShop');
}

async function syncAll() {
  console.log('=== STARTING COMPLETE PARTNER SYNC (TaiKhoan, VuaVia, HupSMS, ThanhPlus, ThapCamMMO) ===');
  const now = new Date().toISOString();

  // -------------------------------------------------------------
  // 1. SYNC TAIKHOAN.SITE
  // -------------------------------------------------------------
  console.log('\n[1/5] Syncing TaiKhoan.site...');
  try {
    const res = await fetch(`${TAIKHOAN_BASE_URL}/api/products.php?api_key=${encodeURIComponent(TAIKHOAN_API_KEY)}`, {
      headers: DEFAULT_HEADERS,
    });
    const tkData = await res.json();
    if (tkData && tkData.categories) {
      for (const cat of tkData.categories) {
        const catSlug = `tk-cat-${cat.id}-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
        await supabaseAdmin.from('Category').upsert({
          id: `tk-cat-${cat.id}`,
          name: sanitizeText(cat.name),
          nameVi: sanitizeText(cat.name),
          slug: catSlug,
          description: `Chuyên mục ${sanitizeText(cat.name)} chính hãng tại BetaShop`,
          image: cat.icon || null,
          isActive: true,
          partnerSource: 'taikhoan.site',
        }, { onConflict: 'id' });

        if (cat.products && Array.isArray(cat.products)) {
          for (const p of cat.products) {
            const pId = `tk-sp-${p.id}`;
            const pSlug = `tk-${p.id}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
            const cost = Number(p.price || 0);
            const retail = Math.round(cost * 1.2);

            await supabaseAdmin.from('Product').upsert({
              id: pId,
              name: sanitizeText(p.name),
              slug: pSlug,
              sku: `TK-${p.id}`,
              barcode: `893800${String(p.id).padStart(6, '0')}`,
              shortDesc: sanitizeText(p.short_description || p.name),
              description: sanitizeText(p.description || `${p.name} - Sản phẩm chính hãng tại BetaShop. Tự động giao hàng 24/7.`),
              unit: 'Tài khoản',
              categoryId: `tk-cat-${cat.id}`,
              costPrice: cost,
              retailPrice: retail,
              partnerPrice: cost,
              markupPercent: 20,
              partnerSource: 'taikhoan.site',
              salePrice: retail,
              status: 'ACTIVE',
              thumbnail: p.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
              createdAt: now,
              updatedAt: now,
            }, { onConflict: 'id' });
          }
        }
      }
      console.log('✓ TaiKhoan.site synced successfully.');
    }
  } catch (err) {
    console.error('Error syncing TaiKhoan.site:', err.message);
  }

  // -------------------------------------------------------------
  // 2. SYNC VUAVIA.IO
  // -------------------------------------------------------------
  console.log('\n[2/5] Syncing VuaVia.io...');
  try {
    const res = await fetch(`${VUAVIA_BASE_URL}/products`, {
      headers: {
        ...DEFAULT_HEADERS,
        'X-Api-Key': VUAVIA_API_KEY,
      },
    });
    const vvData = await res.json();
    if (vvData && vvData.success && Array.isArray(vvData.data)) {
      const catMap = new Map();
      for (const item of vvData.data) {
        if (!catMap.has(item.category_id)) {
          catMap.set(item.category_id, item.category_name || `Danh mục ${item.category_id}`);
        }
      }

      for (const [catId, catName] of catMap.entries()) {
        const catSlug = `vv-cat-${catId}-${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
        await supabaseAdmin.from('Category').upsert({
          id: `vv-cat-${catId}`,
          name: sanitizeText(catName),
          nameVi: sanitizeText(catName),
          slug: catSlug,
          description: `Danh mục ${sanitizeText(catName)} phân phối chính hãng tại BetaShop`,
          image: null,
          isActive: true,
          partnerSource: 'vuavia.io',
        }, { onConflict: 'id' });
      }

      let prodCount = 0;
      for (const p of vvData.data.slice(0, 100)) {
        const pId = `vv-sp-${p.id}`;
        const pSlug = `vv-${p.id}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
        const cost = Number(p.price || 0);
        const retail = Math.round(cost * 1.2);

        const { error } = await supabaseAdmin.from('Product').upsert({
          id: pId,
          name: sanitizeText(p.name),
          slug: pSlug,
          sku: `VV-${p.id}`,
          barcode: `893850${String(p.id).padStart(6, '0')}`,
          shortDesc: sanitizeText(p.description || p.name),
          description: sanitizeText(p.description || `${p.name} - Tài nguyên & dịch vụ chính hãng tại BetaShop. Giao tự động 24/7.`),
          unit: 'Tài khoản',
          categoryId: `vv-cat-${p.category_id}`,
          costPrice: cost,
          retailPrice: retail,
          partnerPrice: cost,
          markupPercent: 20,
          partnerSource: 'vuavia.io',
          salePrice: retail,
          status: 'ACTIVE',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
          createdAt: now,
          updatedAt: now,
        }, { onConflict: 'id' });

        if (!error) prodCount++;
      }
      console.log(`✓ VuaVia.io synced ${catMap.size} categories and ${prodCount} products.`);
    }
  } catch (err) {
    console.error('Error syncing VuaVia.io:', err.message);
  }

  // -------------------------------------------------------------
  // 3. SYNC HUPSMS.COM (Proxy & Proxy VIP)
  // -------------------------------------------------------------
  console.log('\n[3/5] Syncing HupSMS.com (Proxy Services)...');
  try {
    const resProxy = await fetch(`${HUPSMS_BASE_URL}/proxy/services?api_key=${encodeURIComponent(HUPSMS_API_KEY)}`, {
      headers: DEFAULT_HEADERS,
    });
    const proxyData = await resProxy.json();

    const resVip = await fetch(`${HUPSMS_BASE_URL}/vip-proxy/services?api_key=${encodeURIComponent(HUPSMS_API_KEY)}`, {
      headers: DEFAULT_HEADERS,
    });
    const vipData = await resVip.json();

    const catProxyId = 'hup-cat-proxy';
    await supabaseAdmin.from('Category').upsert({
      id: catProxyId,
      name: 'Proxy 4G & Dân Cư',
      nameVi: 'Proxy 4G & Dân Cư',
      slug: 'proxy-4g-dan-cu-viet-nam',
      description: 'Dịch vụ Proxy IPv4/IPv6, 4G Viettel, VNPT, FPT chất lượng cao tại BetaShop',
      isActive: true,
      partnerSource: 'hupsms.com',
    }, { onConflict: 'id' });

    const catVipId = 'hup-cat-vip-proxy';
    await supabaseAdmin.from('Category').upsert({
      id: catVipId,
      name: 'Proxy Xoay VIP',
      nameVi: 'Proxy Xoay VIP',
      slug: 'proxy-xoay-vip-game-mmo',
      description: 'Proxy xoay chất lượng cao theo ngày/tuần/tháng hỗ trợ HTTP và SOCKS5 tại BetaShop',
      isActive: true,
      partnerSource: 'hupsms.com',
    }, { onConflict: 'id' });

    let proxyCount = 0;
    if (proxyData?.data && Array.isArray(proxyData.data)) {
      for (const s of proxyData.data) {
        const pId = `hup-proxy-${s.id}`;
        const pSlug = `hup-proxy-${s.id}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
        const cost = Number(s.price || 0);
        const retail = Math.round(cost * 1.2);

        const { error } = await supabaseAdmin.from('Product').upsert({
          id: pId,
          name: sanitizeText(`Proxy ${s.name}`),
          slug: pSlug,
          sku: `HUP-PX-${s.id}`,
          barcode: `893900${String(s.id).padStart(6, '0')}`,
          shortDesc: sanitizeText(`Proxy ${s.name} hỗ trợ HTTP/SOCKS5`),
          description: sanitizeText(`Dịch vụ Proxy ${s.name}. Khởi tạo tự động, hỗ trợ đổi IP và xác thực username/password qua hệ thống BetaShop.`),
          unit: 'Proxy/Ngày',
          categoryId: catProxyId,
          costPrice: cost,
          retailPrice: retail,
          partnerPrice: cost,
          markupPercent: 20,
          partnerSource: 'hupsms.com',
          salePrice: retail,
          status: 'ACTIVE',
          thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
          createdAt: now,
          updatedAt: now,
        }, { onConflict: 'id' });

        if (!error) proxyCount++;
      }
    }

    if (vipData?.data && Array.isArray(vipData.data)) {
      for (const s of vipData.data) {
        const pId = `hup-vip-${s.id}`;
        const pSlug = `hup-vip-${s.id}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
        const cost = Number(s.price || 0);
        const retail = Math.round(cost * 1.2);

        const { error } = await supabaseAdmin.from('Product').upsert({
          id: pId,
          name: sanitizeText(s.name),
          slug: pSlug,
          sku: `HUP-VIP-${s.id}`,
          barcode: `893950${String(s.id).padStart(6, '0')}`,
          shortDesc: sanitizeText(`${s.name} (${s.category || 'VIP'})`),
          description: sanitizeText(`${s.name} - Proxy xoay sạch, tốc độ cao không giới hạn băng thông, kích hoạt tự động qua hệ thống BetaShop.`),
          unit: 'Gói',
          categoryId: catVipId,
          costPrice: cost,
          retailPrice: retail,
          partnerPrice: cost,
          markupPercent: 20,
          partnerSource: 'hupsms.com',
          salePrice: retail,
          status: 'ACTIVE',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
          createdAt: now,
          updatedAt: now,
        }, { onConflict: 'id' });

        if (!error) proxyCount++;
      }
    }
    console.log(`✓ HupSMS.com synced 2 categories and ${proxyCount} proxy services.`);
  } catch (err) {
    console.error('Error syncing HupSMS.com:', err.message);
  }

  // -------------------------------------------------------------
  // 4. SYNC THANHPLUS.VN
  // -------------------------------------------------------------
  console.log('\n[4/5] Syncing Thanhplus.vn...');
  try {
    const res = await fetch(`${THANHPLUS_BASE_URL}/api/Products?type=all`, {
      headers: {
        ...DEFAULT_HEADERS,
        'X-API-KEY': THANHPLUS_API_KEY,
      },
    });
    const tpData = await res.json();
    if (tpData && tpData.status === 'success' && Array.isArray(tpData.categories)) {
      let tpProdCount = 0;
      for (const cat of tpData.categories) {
        const catSlug = `tp-cat-${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
        const catId = cat.name.toLowerCase().includes('dịch') ? 'tp-cat-dichvu' : 'tp-cat-taikhoan';
        await supabaseAdmin.from('Category').upsert({
          id: catId,
          name: sanitizeText(cat.name),
          nameVi: sanitizeText(cat.name),
          slug: catSlug,
          description: `Nguyên liệu & sản phẩm ${sanitizeText(cat.name)} chính hãng tại BetaShop`,
          isActive: true,
          partnerSource: 'thanhplus.vn',
        }, { onConflict: 'id' });

        if (cat.products && Array.isArray(cat.products)) {
          for (const p of cat.products) {
            const pId = `tp-sp-${p.id}`;
            const pSlug = `tp-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
            const cost = Number(p.price || 0);
            const retail = Math.round(cost * 1.2);

            const { error } = await supabaseAdmin.from('Product').upsert({
              id: pId,
              name: sanitizeText(p.name),
              slug: pSlug,
              sku: `TP-${p.id.slice(0, 8)}`,
              barcode: `893980${Math.floor(100000 + Math.random() * 900000)}`,
              shortDesc: sanitizeText((p.shortContent || p.name).replace(/<[^>]*>?/gm, '')),
              description: sanitizeText(`${p.name} - Sản phẩm nguyên liệu chính hãng phân phối tại BetaShop. Tự động giao hàng 24/7.`),
              unit: 'Tài khoản',
              categoryId: catId,
              costPrice: cost,
              retailPrice: retail,
              partnerPrice: cost,
              markupPercent: 20,
              partnerSource: 'thanhplus.vn',
              salePrice: retail,
              status: 'ACTIVE',
              thumbnail: p.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
              createdAt: now,
              updatedAt: now,
            }, { onConflict: 'id' });

            if (!error) tpProdCount++;
          }
        }
      }
      console.log(`✓ Thanhplus.vn synced categories and ${tpProdCount} products.`);
    }
  } catch (err) {
    console.error('Error syncing Thanhplus.vn:', err.message);
  }

  // -------------------------------------------------------------
  // 5. SYNC THAPCAMMMO.VN
  // -------------------------------------------------------------
  console.log('\n[5/5] Syncing ThapCamMMO.vn...');
  try {
    const res = await fetch(`${THAPCAMMMO_BASE_URL}/v1/services`, {
      headers: {
        ...DEFAULT_HEADERS,
        'X-API-Key': THAPCAMMMO_API_KEY,
      },
    });
    const tcmData = await res.json();
    if (tcmData && tcmData.data && Array.isArray(tcmData.data)) {
      // Create Categories
      const categoriesToCreate = [
        {
          id: 'tcm-cat-member',
          name: 'Tăng Member & Kéo Nhóm',
          nameVi: 'Tăng Member & Kéo Nhóm',
          slug: 'tang-member-keo-nhom-mmo',
          description: 'Dịch vụ tăng thành viên nhóm Zalo, Telegram, Facebook bảo hành an toàn, kích hoạt tự động tại BetaShop',
        },
        {
          id: 'tcm-cat-group',
          name: 'Cộng Đồng & Nhóm Xây Sẵn',
          nameVi: 'Cộng Đồng & Nhóm Xây Sẵn',
          slug: 'cong-dong-nhom-xay-san-mmo',
          description: 'Hệ thống nhóm, cộng đồng có sẵn lượng thành viên ổn định và tương tác cao tại BetaShop',
        },
        {
          id: 'tcm-cat-catalog',
          name: 'Phần Mềm & Công Cụ MMO',
          nameVi: 'Phần Mềm & Công Cụ MMO',
          slug: 'phan-mem-cong-cu-marketing-mmo',
          description: 'Các công cụ bản quyền, phần mềm automation marketing và tài liệu tối ưu MMO tại BetaShop',
        },
        {
          id: 'tcm-cat-buff',
          name: 'Dịch Vụ Buff Tương Tác MXH',
          nameVi: 'Dịch Vụ Buff Tương Tác MXH',
          slug: 'dich-vu-buff-tuong-tac-mxh',
          description: 'Hỗ trợ tăng like, sub, view, comment đa nền tảng mạng xã hội nhanh chóng, an toàn tại BetaShop',
        },
      ];

      for (const cat of categoriesToCreate) {
        await supabaseAdmin.from('Category').upsert({
          id: cat.id,
          name: cat.name,
          nameVi: cat.nameVi,
          slug: cat.slug,
          description: cat.description,
          isActive: true,
          partnerSource: 'thapcammmo.vn',
        }, { onConflict: 'id' });
      }

      // Filter and insert products
      // - all add_member (7)
      // - all sell_group (12)
      // - all sell_catalog (13)
      // - top 20 sell_buff
      const members = tcmData.data.filter((s) => s.serviceType === 'add_member');
      const groups = tcmData.data.filter((s) => s.serviceType === 'sell_group');
      const catalogs = tcmData.data.filter((s) => s.serviceType === 'sell_catalog');
      const buffs = tcmData.data.filter((s) => s.serviceType === 'sell_buff').slice(0, 20);

      const itemsToSync = [
        ...members.map((s) => ({ ...s, catId: 'tcm-cat-member', unit: 'Member' })),
        ...groups.map((s) => ({ ...s, catId: 'tcm-cat-group', unit: 'Nhóm' })),
        ...catalogs.map((s) => ({ ...s, catId: 'tcm-cat-catalog', unit: 'Bản quyền' })),
        ...buffs.map((s) => ({ ...s, catId: 'tcm-cat-buff', unit: 'Gói tương tác' })),
      ];

      let tcmCount = 0;
      for (const item of itemsToSync) {
        const pId = `tcm-sp-${item.id}`;
        const pSlug = `tcm-${item.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`.slice(0, 80);
        const cost = Number(item.price || 0);
        const retail = Math.round(cost * 1.25); // 25% markup

        const highlight = item.meta?.highlightNote ? ` ${item.meta.highlightNote}` : '';
        const shortDesc = sanitizeText(`${item.name}${highlight}`.slice(0, 160));
        const fullDesc = sanitizeText(
          `${item.name} - Dịch vụ chính hãng tại BetaShop. Tự động xử lý 24/7, cam kết chất lượng và hỗ trợ kỹ thuật tận tình.${highlight}`
        );

        const thumbnail =
          item.catId === 'tcm-cat-member'
            ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
            : item.catId === 'tcm-cat-group'
            ? 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80'
            : item.catId === 'tcm-cat-catalog'
            ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80';

        const { error } = await supabaseAdmin.from('Product').upsert({
          id: pId,
          name: sanitizeText(item.name),
          slug: pSlug,
          sku: `TCM-${item.id}`,
          barcode: `893990${String(item.id).padStart(6, '0')}`,
          shortDesc: shortDesc,
          description: fullDesc,
          unit: item.unit,
          categoryId: item.catId,
          costPrice: cost,
          retailPrice: retail,
          partnerPrice: cost,
          markupPercent: 25,
          partnerSource: 'thapcammmo.vn',
          salePrice: retail,
          status: 'ACTIVE',
          thumbnail: thumbnail,
          createdAt: now,
          updatedAt: now,
        }, { onConflict: 'id' });

        if (!error) tcmCount++;
      }
      console.log(`✓ ThapCamMMO.vn synced 4 categories and ${tcmCount} services.`);
    }
  } catch (err) {
    console.error('Error syncing ThapCamMMO.vn:', err.message);
  }

  console.log('\n=== COMPLETE PARTNER SYNC COMPLETED SUCCESSFULLY ===');
}

syncAll();
