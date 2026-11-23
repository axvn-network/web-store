import prisma from './prisma';
import { AutomationEngine } from './automationEngine';

export interface EnqueueOptions {
  singletonKey?: string;
  runAfter?: Date;
  maxAttempts?: number;
}

/**
 * Serverless-Optimized Job Queue Engine (pg-boss pattern on Supabase Postgres)
 * Designed specifically for Netlify Serverless & Scheduled Function execution.
 */
export class JobQueue {
  /**
   * Enqueues an asynchronous background job with idempotency (singletonKey).
   */
  static async enqueue(jobType: string, payload: any, options: EnqueueOptions = {}) {
    const { singletonKey, runAfter, maxAttempts = 5 } = options;

    if (singletonKey) {
      const existing = await prisma.queueJob.findFirst({
        where: {
          singletonKey,
          status: { in: ['PENDING', 'PROCESSING'] },
        },
      });

      if (existing) {
        return {
          jobId: existing.id,
          status: existing.status,
          deduplicated: true,
        };
      }
    }

    const job = await prisma.queueJob.create({
      data: {
        jobType,
        singletonKey: singletonKey || null,
        payload: JSON.stringify(payload),
        status: 'PENDING',
        maxAttempts,
        runAfter: runAfter || new Date(),
      },
    });

    return {
      jobId: job.id,
      status: job.status,
      deduplicated: false,
    };
  }

  /**
   * Fetches and locks a batch of pending jobs for processing.
   */
  static async fetchNextBatch(batchSize = 10) {
    const now = new Date();
    const lockUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 min lease

    return await prisma.$transaction(async (tx) => {
      const pendingJobs = await tx.queueJob.findMany({
        where: {
          status: 'PENDING',
          runAfter: { lte: now },
        },
        orderBy: { createdAt: 'asc' },
        take: batchSize,
      });

      if (pendingJobs.length === 0) return [];

      const ids = pendingJobs.map((j) => j.id);

      await tx.queueJob.updateMany({
        where: { id: { in: ids } },
        data: {
          status: 'PROCESSING',
          lockedUntil: lockUntil,
        },
      });

      return pendingJobs.map((j) => ({
        ...j,
        parsedPayload: JSON.parse(j.payload),
      }));
    });
  }

  /**
   * Marks a job as successfully completed.
   */
  static async complete(jobId: string) {
    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        lockedUntil: null,
      },
    });
  }

  /**
   * Handles job failure with exponential backoff retry policy (1m, 5m, 15m, 1h, 6h).
   */
  static async fail(jobId: string, error: string) {
    const job = await prisma.queueJob.findUnique({
      where: { id: jobId },
    });

    if (!job) return;

    const newAttempts = job.attempts + 1;
    const backoffMinutes = [1, 5, 15, 60, 360]; // 1m, 5m, 15m, 1h, 6h
    const delayMinutes = backoffMinutes[Math.min(newAttempts - 1, backoffMinutes.length - 1)];

    if (newAttempts < job.maxAttempts) {
      // Retry after exponential backoff
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: 'PENDING',
          attempts: newAttempts,
          lastError: error,
          runAfter: new Date(Date.now() + delayMinutes * 60 * 1000),
          lockedUntil: null,
        },
      });
    } else {
      // Permanently failed after max retries -> Escalate to AutomationEngine
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          attempts: newAttempts,
          lastError: error,
          lockedUntil: null,
        },
      });

      // Parse payload to check if this is an order fulfillment job
      try {
        const payload = JSON.parse(job.payload);
        if (payload.orderId && payload.orderItemId) {
          await AutomationEngine.handleOrderFailure(payload.orderId, payload.orderItemId, error);
        }
      } catch (e) {
        console.error('Failed to trigger auto-escalation on job failure:', e);
      }
    }
  }
}
