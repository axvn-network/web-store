import http from 'http';

interface TestResult {
  route: string;
  status: number;
  pass: boolean;
  notes?: string;
}

const routesToTest = [
  // Storefront
  '/',
  '/san-pham',
  '/gio-hang',
  '/thanh-toan',
  '/tra-cuu-don-hang',
  '/tin-tuc',
  '/he-thong-cua-hang',
  '/gioi-thieu',
  '/yeu-thich',
  '/dang-nhap',
  '/dang-ky',

  // Admin Core
  '/admin',
  '/admin/dashboard',
  '/admin/products',
  '/admin/products/new',
  '/admin/products/variants',
  '/admin/categories',
  '/admin/brands',
  '/admin/suppliers',
  '/admin/warehouses',

  // Admin Inventory
  '/admin/inventory/stock',
  '/admin/inventory/imports',
  '/admin/inventory/exports',
  '/admin/inventory/transfers',
  '/admin/inventory/adjustments',
  '/admin/inventory/history',

  // Admin Orders
  '/admin/orders',
  '/admin/orders/pos',
  '/admin/orders/returns',

  // Admin CRM & Marketing
  '/admin/customers',
  '/admin/promotions',
  '/admin/coupons',
  '/admin/shipping',
  '/admin/reviews',

  // Admin Reports
  '/admin/reports',
  '/admin/reports/revenue',
  '/admin/reports/inventory',
  '/admin/reports/products',
  '/admin/reports/customers',

  // Admin Management
  '/admin/staff',
  '/admin/roles',
  '/admin/settings',
  '/admin/notifications',

  // APIs
  '/api/admin/data',
  '/api/products',
  '/api/categories',
  '/api/brands',
  '/api/orders',
  '/api/stats',
];

function testGet(path: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const req = http.get(
      {
        host: '127.0.0.1',
        port: 3000,
        path,
        headers: {
          'User-Agent': 'BetashopTester/1.0',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          const isRedirect = res.statusCode === 307 || res.statusCode === 308 || res.statusCode === 302;
          const isSuccess = res.statusCode === 200 || isRedirect;
          const hasErrorText =
            body.includes('Internal Server Error') ||
            body.includes('Cannot find module') ||
            body.includes('Application error');

          resolve({
            route: path,
            status: res.statusCode || 0,
            pass: isSuccess && !hasErrorText,
            notes: hasErrorText ? 'Contains error message in body' : undefined,
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        route: path,
        status: 0,
        pass: false,
        notes: err.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        route: path,
        status: 0,
        pass: false,
        notes: 'Timeout after 5s',
      });
    });
  });
}

function testPost(path: string, payload: any): Promise<TestResult> {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    const req = http.request(
      {
        host: '127.0.0.1',
        port: 3000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let pass = res.statusCode === 200 || res.statusCode === 201;
          try {
            const parsed = JSON.parse(body);
            if (parsed.success === false) pass = false;
          } catch (e) {
            pass = false;
          }
          resolve({
            route: `POST ${path} (${payload.action || 'payload'})`,
            status: res.statusCode || 0,
            pass,
            notes: pass ? 'OK' : body.slice(0, 100),
          });
        });
      }
    );

    req.on('error', (err) => {
      resolve({
        route: `POST ${path}`,
        status: 0,
        pass: false,
        notes: err.message,
      });
    });

    req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  console.log('====================================================');
  console.log('BẮT ĐẦU KIỂM TRA TOÀN DIỆN MỌI ROUTE & API CỦA HỆ THỐNG');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  console.log('--- 1. KIỂM TRA GET CÁC MÀN HÌNH & ROUTE ---');
  for (const route of routesToTest) {
    const res = await testGet(route);
    if (res.pass) {
      passed++;
      console.log(`✓ [PASS] [${res.status}] ${res.route}`);
    } else {
      failed++;
      console.log(`✗ [FAIL] [${res.status}] ${res.route} - ${res.notes || 'Unknown error'}`);
    }
  }

  console.log('\n--- 2. KIỂM TRA NGHIỆP VỤ POST ĐỌC/GHI CƠ SỞ DỮ LIỆU ---');
  const postTests = [
    {
      path: '/api/admin/data',
      payload: {
        action: 'create_product',
        payload: {
          title: 'Nồi Cơm Điện Cao Tần Elmich RCE-0896',
          slug: 'noi-com-dien-cao-tan-elmich-rce-0896',
          category: 'Nồi cơm điện',
          brand: 'Elmich',
          price: 3490000,
          originalPrice: 4200000,
          stock: 45,
          sku: 'ELM-RCE0896',
          barcode: '893850123456',
        },
      },
    },
    {
      path: '/api/admin/data',
      payload: {
        action: 'create_order',
        payload: {
          orderType: 'POS',
          customerName: 'Khách hàng thử nghiệm POS',
          phone: '0912 999 888',
          items: [
            {
              productId: 'sp-01',
              title: 'Nồi chiên không dầu Philips 6.2L',
              price: 2890000,
              quantity: 1,
            },
          ],
          totalAmount: 2890000,
          discountAmount: 100000,
          finalAmount: 2790000,
          paymentMethod: 'CASH',
        },
      },
    },
    {
      path: '/api/admin/data',
      payload: {
        action: 'create_supplier',
        payload: {
          code: 'NCC-TEST-01',
          name: 'Công ty Thiết Bị Gia Dụng Test',
          phone: '024 1122 3344',
          taxCode: '0109999888',
        },
      },
    },
    {
      path: '/api/admin/data',
      payload: {
        action: 'create_customer',
        payload: {
          name: 'Hoàng Minh Châu',
          phone: '0988 777 666',
          group: 'Khách lẻ',
        },
      },
    },
    {
      path: '/api/admin/data',
      payload: {
        action: 'update_settings',
        payload: {
          hotline: '1900 8237',
          vatDefault: 10,
        },
      },
    },
    {
      path: '/api/orders',
      payload: {
        customer: {
          fullName: 'Nguyễn Văn Đặt Hàng Storefront',
          phone: '0933 111 222',
          address: '123 Cầu Giấy, Hà Nội',
          province: 'Hà Nội',
          district: 'Cầu Giấy',
        },
        paymentMethod: 'COD',
        items: [
          {
            productId: 'sp-02',
            title: 'Nồi cơm điện Cuckoo',
            price: 7690000,
            quantity: 1,
            image: '',
          },
        ],
        totalPrice: 7690000,
        shippingFee: 0,
        finalTotal: 7690000,
      },
    },
  ];

  for (const test of postTests) {
    const res = await testPost(test.path, test.payload);
    if (res.pass) {
      passed++;
      console.log(`✓ [PASS] [${res.status}] ${res.route}`);
    } else {
      failed++;
      console.log(`✗ [FAIL] [${res.status}] ${res.route} - ${res.notes || 'Error'}`);
    }
  }

  console.log('\n====================================================');
  console.log(`KẾT QUẢ: TỔNG ${passed + failed} TEST CASES`);
  console.log(`✓ THÀNH CÔNG: ${passed}`);
  console.log(`✗ THẤT BẠI:   ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests().catch(console.error);
