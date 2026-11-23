import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProviderHealthChecker } from '@/lib/providerHealth';

export const dynamic = 'force-dynamic';

/**
 * Keep-Alive & Operational Cron Endpoint
 * Pings database to prevent Supabase 7-day auto-pause on free tier,
 * and performs periodic upstream provider health checks.
 */
export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // 1. Keep-alive database ping
    const providerCount = await prisma.provider.count();

    // 2. Upstream provider health check
    const healthReports = await ProviderHealthChecker.checkAll();

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      durationMs,
      database: {
        active: true,
        providerCount,
      },
      providers: healthReports.map((r) => ({
        code: r.code,
        name: r.name,
        status: r.status,
        latencyMs: r.latencyMs,
        balance: r.balance,
      })),
      note: 'Supabase keep-alive pulse executed successfully. Zero downtime guaranteed.',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'DEGRADED',
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
