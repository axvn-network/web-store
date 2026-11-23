import prisma from '../lib/prisma';

const DEFAULT_RULES = [
  {
    key: 'auto_refund_max_threshold',
    name: 'Ngưỡng Tự Động Hoàn Tiền (Auto-Refund)',
    category: 'FULFILLMENT',
    value: JSON.stringify({
      maxAmount: 200000, // 200,000 VND
      sendApologyEmail: true,
      voucherPercent: 5,
    }),
    isEnabled: true,
  },
  {
    key: 'circuit_breaker_config',
    name: 'Cấu hình Ngắt Mạch Provider (Circuit Breaker)',
    category: 'FULFILLMENT',
    value: JSON.stringify({
      errorPercentThreshold: 50,
      windowMinutes: 10,
      tripDurationMinutes: 15,
      recoverySuccessRequired: 2,
    }),
    isEnabled: true,
  },
  {
    key: 'price_change_governance',
    name: 'Quy tắc Biến Động Giá Nhập & Bán',
    category: 'PRICING',
    value: JSON.stringify({
      maxPercentIncrease: 10, // Cost tăng > 10% cần admin duyệt
      autoApplyDecrease: true, // Cost giảm tự động hạ giá bán
      roundToThousand: true,
    }),
    isEnabled: true,
  },
  {
    key: 'stock_replenish_alert',
    name: 'Cảnh Báo Tồn Kho Key Tự Động',
    category: 'FULFILLMENT',
    value: JSON.stringify({
      minStockMultiplier: 1.5,
      cooldownHours: 24, // Chỉ gửi 1 cảnh báo/24h cho cùng 1 sản phẩm
      groupAlerts: true,
    }),
    isEnabled: true,
  },
  {
    key: 'fraud_risk_scoring',
    name: 'Chấm Điểm Rủi Ro Đơn Hàng (Fraud Scoring)',
    category: 'FRAUD',
    value: JSON.stringify({
      passThreshold: 30, // < 30 xử lý bình thường
      holdThreshold: 70, // 30-70 giữ 30 phút kiểm tra
      reviewThreshold: 70, // > 70 chuyển hàng chờ review
      firstOrderMaxVnd: 10000000,
    }),
    isEnabled: true,
  },
  {
    key: 'escalation_notification_hub',
    name: 'Trung Tâm Điều Hướng & Gộp Nhóm Cảnh Báo',
    category: 'NOTIFICATION',
    value: JSON.stringify({
      groupWindowMinutes: 30, // Gộp các lỗi trong 30 phút
      maxAlertsPerDay: 10, // Không spam quá 10 thông báo/ngày
      telegramEnabled: true,
      emailDigestEnabled: true,
    }),
    isEnabled: true,
  },
];

async function seed() {
  console.log('=== SEEDING AUTOMATION RULES & THRESHOLDS ===');
  for (const r of DEFAULT_RULES) {
    await prisma.automationRule.upsert({
      where: { key: r.key },
      update: {
        name: r.name,
        category: r.category,
        value: r.value,
        isEnabled: r.isEnabled,
      },
      create: {
        key: r.key,
        name: r.name,
        category: r.category,
        value: r.value,
        isEnabled: r.isEnabled,
      },
    });
    console.log(`✓ Rule [${r.key}] "${r.name}" upserted.`);
  }
  console.log('=== AUTOMATION RULES SEED COMPLETED ===');
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
