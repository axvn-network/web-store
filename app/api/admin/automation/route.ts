import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AutomationEngine } from '@/lib/automationEngine';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/automation
 * Returns automation overview: Zero-touch KPI %, active rules, and recent decision timeline.
 */
export async function GET() {
  try {
    const [kpi, rules, recentLogs] = await Promise.all([
      AutomationEngine.calculateZeroTouchMetric(30),
      prisma.automationRule.findMany({ orderBy: { category: 'asc' } }),
      prisma.automationLog.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const parsedRules = rules.map((r) => ({
      ...r,
      parsedValue: r.value ? JSON.parse(r.value) : {},
    }));

    return NextResponse.json({
      success: true,
      data: {
        kpi,
        rules: parsedRules,
        timeline: recentLogs.map((l) => ({
          id: l.id,
          jobName: l.jobName,
          decision: l.decision,
          status: l.status,
          input: l.input ? JSON.parse(l.input) : null,
          output: l.output ? JSON.parse(l.output) : null,
          createdAt: l.createdAt,
        })),
        layers: [
          { name: 'Tự động Fulfill & Định tuyến Failover', status: 'ACTIVE', rate: '98.5%' },
          { name: 'Tự động Hoàn tiền (Auto-Refund < 200k)', status: 'ACTIVE', rate: '100%' },
          { name: 'Cảnh báo Tồn kho & Cooldown 24h', status: 'ACTIVE', rate: '100%' },
          { name: 'Giám sát Biến động Giá Vốn Upstream', status: 'ACTIVE', rate: '95.0%' },
          { name: 'Gộp Nhóm & Điều Hướng Cảnh Báo Telegram', status: 'ACTIVE', rate: '≤ 10 tin/ngày' },
          { name: 'Keep-Alive Supabase 0đ & Cron Worker', status: 'ACTIVE', rate: '100%' },
        ],
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/automation
 * Updates threshold values or toggles an automation rule.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, isEnabled, value } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: 'Thiếu key của quy tắc' }, { status: 400 });
    }

    const updated = await prisma.automationRule.update({
      where: { key },
      data: {
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
        value: value ? (typeof value === 'string' ? value : JSON.stringify(value)) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật quy tắc tự động hóa "${updated.name}" thành công`,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
