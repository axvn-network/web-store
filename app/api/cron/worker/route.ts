import { NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { FulfillmentRouter } from '@/lib/fulfillmentRouter';
import { EscalationHub } from '@/lib/escalationHub';
import { AutomationEngine } from '@/lib/automationEngine';

export const dynamic = 'force-dynamic';

/**
 * Netlify Scheduled Function / Cron Worker Endpoint
 * Triggered every minute to process background fulfillment queue jobs without long-running processes.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  const results: any[] = [];

  try {
    // 1. Fetch pending batch
    const jobs = await JobQueue.fetchNextBatch(10);

    // 2. Process each job
    for (const job of jobs) {
      try {
        if (job.jobType === 'FULFILL_ORDER_ITEM') {
          const { productId, orderId, orderItemId, payload } = job.parsedPayload;

          const fulfillRes = await FulfillmentRouter.routeAndFulfill(productId, payload || {});

          if (fulfillRes.success) {
            await JobQueue.complete(job.id);
            await AutomationEngine.logDecision(
              'queue_worker',
              'FULFILL_SUCCESS',
              { jobId: job.id, orderId },
              { upstreamOrderId: fulfillRes.upstreamOrderId },
              'SUCCESS'
            );
            results.push({ id: job.id, status: 'COMPLETED' });
          } else {
            await JobQueue.fail(job.id, fulfillRes.error || 'Fulfillment router error');
            results.push({ id: job.id, status: 'RETRYING_OR_FAILED', error: fulfillRes.error });
          }
        } else {
          // Other job types
          await JobQueue.complete(job.id);
          results.push({ id: job.id, status: 'COMPLETED' });
        }
      } catch (err: any) {
        await JobQueue.fail(job.id, err.message);
        results.push({ id: job.id, status: 'ERROR', error: err.message });
      }
    }

    // 3. Flush any grouped alerts waiting in EscalationHub
    await EscalationHub.flushGroupedAlerts();

    return NextResponse.json({
      success: true,
      processedCount: jobs.length,
      durationMs: Date.now() - startTime,
      jobs: results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
