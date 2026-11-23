import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encrypt, decrypt, mask } from '@/lib/crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/providers
 * Returns all upstream providers with masked API keys and service counts.
 */
export async function GET() {
  try {
    const [providers, productCounts] = await Promise.all([
      prisma.provider.findMany({
        include: {
          _count: {
            select: { upstreamServices: true, healthLogs: true },
          },
        },
        orderBy: { priority: 'asc' },
      }),
      prisma.product.groupBy({
        by: ['partnerSource'],
        _count: { id: true },
      }),
    ]);

    const countMap: Record<string, number> = {};
    for (const item of productCounts) {
      if (item.partnerSource) {
        countMap[item.partnerSource.toLowerCase()] = item._count.id;
      }
    }

    const sanitized = providers.map((p) => {
      let maskedKey = '****';
      try {
        const rawKey = decrypt(p.apiKeyEncrypted);
        maskedKey = mask(rawKey, 6);
      } catch {
        maskedKey = '****[Encrypted]';
      }

      // Map product count by provider code or domain
      const c = p.code.toLowerCase();
      const prodCount =
        countMap[`${c}.com`] ||
        countMap[`${c}.io`] ||
        countMap[`${c}.vn`] ||
        countMap[`${c}.site`] ||
        countMap[c] ||
        0;

      return {
        id: p.id,
        code: p.code,
        name: p.name,
        apiBaseUrl: p.apiBaseUrl,
        maskedApiKey: maskedKey,
        balance: p.balance,
        currency: p.currency,
        status: p.status,
        priority: p.priority,
        healthCheckUrl: p.healthCheckUrl,
        lastHealthCheckAt: p.lastHealthCheckAt,
        notes: p.notes,
        servicesCount: p._count.upstreamServices,
        productsCount: prodCount,
        healthLogsCount: p._count.healthLogs,
        createdAt: p.createdAt,
      };
    });

    // Also include local internal warehouse/provider
    sanitized.push({
      id: 'provider-local',
      code: 'local',
      name: 'Kho Nội Bộ BetaShop (XVPS/Local)',
      apiBaseUrl: 'Internal / Self-hosted Database',
      maskedApiKey: 'LOCAL_SECURE_VAULT',
      balance: 100000000,
      currency: 'VND',
      status: 'active',
      priority: 0,
      healthCheckUrl: '/api/admin/data',
      lastHealthCheckAt: new Date(),
      notes: 'Hạ tầng máy chủ, key nội bộ và kho hàng vật lý trực tiếp',
      servicesCount: 1,
      productsCount: countMap['local'] || 13,
      healthLogsCount: 1,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: sanitized,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/providers
 * Creates or updates an upstream provider, encrypting API key with AES-256-GCM.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, apiBaseUrl, apiKey, priority, healthCheckUrl, notes } = body;

    if (!code || !name || !apiBaseUrl || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ: Mã (code), Tên, Base URL và API Key' },
        { status: 400 }
      );
    }

    const encryptedKey = encrypt(apiKey);

    const provider = await prisma.provider.upsert({
      where: { code },
      update: {
        name,
        apiBaseUrl,
        apiKeyEncrypted: encryptedKey,
        priority: Number(priority) || 1,
        healthCheckUrl: healthCheckUrl || null,
        notes: notes || null,
      },
      create: {
        code,
        name,
        apiBaseUrl,
        apiKeyEncrypted: encryptedKey,
        priority: Number(priority) || 1,
        healthCheckUrl: healthCheckUrl || null,
        notes: notes || null,
        status: 'active',
        balance: 0,
        currency: 'VND',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Đã lưu nhà cung cấp "${provider.name}" thành công (Khóa API đã được mã hóa AES-256-GCM)`,
      data: {
        id: provider.id,
        code: provider.code,
        name: provider.name,
        status: provider.status,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
