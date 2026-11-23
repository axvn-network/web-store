import prisma from '../lib/prisma';
import { encrypt } from '../lib/crypto';

interface ProviderSeed {
  code: string;
  name: string;
  apiBaseUrl: string;
  apiKey: string;
  priority: number;
  healthCheckUrl: string;
  notes: string;
}

const PROVIDERS: ProviderSeed[] = [
  {
    code: 'hupsms',
    name: 'HupSMS Gateway',
    apiBaseUrl: 'https://hupsms.com/api/v1',
    apiKey: 'hup_diU_B9nHS0KxWqKcYV7sBbdpoWgnV9y2TXnMTXgVOgBfRcMm',
    priority: 1,
    healthCheckUrl: 'https://hupsms.com/api/v1/proxy/services',
    notes: 'Nhà cung cấp Proxy dân cư, 4G xoay & dịch vụ Zalo',
  },
  {
    code: 'taikhoan',
    name: 'TaiKhoan.site API',
    apiBaseUrl: 'https://taikhoan.site',
    apiKey: '2cd87d67c9b19e9ab7b6a0a944cefbe3jm90cW4wgsqhp7BiXbdnauUK8EMH3FC5',
    priority: 2,
    healthCheckUrl: 'https://taikhoan.site/api/profile.php',
    notes: 'Nhà cung cấp tài khoản digital, phần mềm, cloud VPS',
  },
  {
    code: 'vuavia',
    name: 'VuaVia.io Platform',
    apiBaseUrl: 'https://api.vuavia.io/api/v2',
    apiKey: 'vav_e9935f2bf607d802b82c44272742b513',
    priority: 2,
    healthCheckUrl: 'https://api.vuavia.io/api/v2/wallet/balance',
    notes: 'Nền tảng nguyên liệu via, clone, BM & tài khoản quảng cáo',
  },
  {
    code: 'thanhplus',
    name: 'ThanhPlus.vn Services',
    apiBaseUrl: 'https://thanhplus.vn',
    apiKey: 'IWS8ZDTR7LZ38O41KZOW1795181728795M45C8B',
    priority: 3,
    healthCheckUrl: 'https://thanhplus.vn/api/User/GetInfo',
    notes: 'Nhà cung cấp tài khoản bản quyền & dịch vụ đồ họa',
  },
  {
    code: 'thapcammmo',
    name: 'ThapCamMMO Ecosystem',
    apiBaseUrl: 'https://api.thapcammmo.vn',
    apiKey: 'fag_QP1koV6eCa-PP4f0ICZ_7WgUUmQmTjxd',
    priority: 1,
    healthCheckUrl: 'https://api.thapcammmo.vn/v1/balance',
    notes: 'Dịch vụ kéo nhóm, cộng đồng có sẵn, phần mềm & buff tương tác',
  },
];

async function seed() {
  console.log('=== SEEDING AGGREGATOR PROVIDERS WITH AES-256-GCM ENCRYPTION ===\n');

  for (const p of PROVIDERS) {
    const encryptedKey = encrypt(p.apiKey);

    const provider = await prisma.provider.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        apiBaseUrl: p.apiBaseUrl,
        apiKeyEncrypted: encryptedKey,
        priority: p.priority,
        healthCheckUrl: p.healthCheckUrl,
        notes: p.notes,
        status: 'active',
      },
      create: {
        code: p.code,
        name: p.name,
        apiBaseUrl: p.apiBaseUrl,
        apiKeyEncrypted: encryptedKey,
        priority: p.priority,
        healthCheckUrl: p.healthCheckUrl,
        notes: p.notes,
        status: 'active',
        balance: 0,
        currency: 'VND',
      },
    });

    console.log(`✓ Provider [${provider.code}] "${provider.name}" upserted (API key encrypted with AES-256-GCM).`);
  }

  const count = await prisma.provider.count();
  console.log(`\n=== Total Providers in DB: ${count} ===`);
}

seed()
  .catch((e) => {
    console.error('Error seeding providers:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
