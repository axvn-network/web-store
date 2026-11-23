import prisma from './prisma';
import { decrypt } from './crypto';

export interface ProviderHealthReport {
  code: string;
  name: string;
  status: 'active' | 'degraded' | 'down';
  latencyMs: number;
  statusCode: number;
  isSuccess: boolean;
  errorMessage?: string;
  balance?: number;
}

/**
 * Realtime Upstream Provider Health Monitoring Service
 */
export class ProviderHealthChecker {
  /**
   * Pings all registered providers, logs health metrics and adjusts active/degraded/down statuses.
   */
  static async checkAll(): Promise<ProviderHealthReport[]> {
    const providers = await prisma.provider.findMany();
    const reports: ProviderHealthReport[] = [];

    for (const p of providers) {
      const report = await this.checkSingle(p);
      reports.push(report);
    }

    return reports;
  }

  /**
   * Checks health of a single provider by ID or code.
   */
  static async checkSingle(provider: any): Promise<ProviderHealthReport> {
    const startTime = Date.now();
    let isSuccess = false;
    let statusCode = 500;
    let errorMessage: string | undefined;
    let balance: number | undefined = provider.balance;

    try {
      const decryptedKey = decrypt(provider.apiKeyEncrypted);
      const url = provider.healthCheckUrl || `${provider.apiBaseUrl}/health`;

      // Set timeout of 5000ms
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const headers: Record<string, string> = {
        'User-Agent': 'BetaShop-Aggregator-HealthCheck/2.0',
        Accept: 'application/json',
      };

      if (provider.code === 'hupsms') {
        headers['X-API-KEY'] = decryptedKey;
      } else if (provider.code === 'vuavia' || provider.code === 'thapcammmo') {
        headers['X-Api-Key'] = decryptedKey;
      } else if (provider.code === 'thanhplus') {
        headers['X-API-KEY'] = decryptedKey;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      statusCode = res.status;
      isSuccess = res.ok;

      if (!res.ok) {
        errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      } else {
        const body = await res.json().catch(() => ({}));
        if (body.data?.balance !== undefined) {
          balance = Number(body.data.balance);
        } else if (body.balance !== undefined) {
          balance = Number(body.balance);
        }
      }
    } catch (err: any) {
      isSuccess = false;
      errorMessage = err.name === 'AbortError' ? 'Timeout vượt quá 5000ms' : err.message;
      statusCode = 504;
    }

    const latencyMs = Date.now() - startTime;

    // Log to ProviderHealthLog
    await prisma.providerHealthLog.create({
      data: {
        providerId: provider.id,
        statusCode,
        latencyMs,
        isSuccess,
        errorMessage: errorMessage || null,
      },
    });

    // Determine status: 3 consecutive failures = degraded, 5 = down
    let newStatus: string = provider.status;
    if (!isSuccess) {
      const recentErrors = await prisma.providerHealthLog.count({
        where: {
          providerId: provider.id,
          isSuccess: false,
          checkedAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
        },
      });

      if (recentErrors >= 5) {
        newStatus = 'down';
      } else if (recentErrors >= 2) {
        newStatus = 'degraded';
      }
    } else {
      newStatus = 'active';
    }

    // Update Provider record
    await prisma.provider.update({
      where: { id: provider.id },
      data: {
        status: newStatus,
        lastHealthCheckAt: new Date(),
        balance: balance !== undefined ? balance : provider.balance,
      },
    });

    return {
      code: provider.code,
      name: provider.name,
      status: newStatus as any,
      latencyMs,
      statusCode,
      isSuccess,
      errorMessage,
      balance,
    };
  }
}
