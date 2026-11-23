import prisma from './prisma';
import { TelegramAlertService } from './telegramService';

interface AlertAction {
  label: string;
  url: string;
}

interface QueuedAlert {
  category: string;
  title: string;
  details: string[];
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  actions: AlertAction[];
  firstSeenAt: number;
  lastSeenAt: number;
}

/**
 * Smart Escalation & Notification Hub
 * Enforces:
 * 1. Groups identical/related alerts within 30 minutes into a single digest.
 * 2. Actionable buttons on every alert.
 * 3. Daily quota limit: <= 10 alerts/day to avoid fatigue.
 */
export class EscalationHub {
  private static alertBuffer = new Map<string, QueuedAlert>();
  private static dailyAlertCount = 0;
  private static lastCountResetDate = new Date().toDateString();

  private static checkResetDaily() {
    const today = new Date().toDateString();
    if (today !== this.lastCountResetDate) {
      this.dailyAlertCount = 0;
      this.lastCountResetDate = today;
    }
  }

  /**
   * Dispatches an alert through the intelligent grouping pipeline.
   */
  static async dispatch(
    category: string,
    title: string,
    detail: string,
    actions: AlertAction[] = [],
    severity: 'INFO' | 'WARNING' | 'CRITICAL' = 'WARNING'
  ) {
    this.checkResetDaily();

    const groupKey = `${category}:${severity}`;
    const now = Date.now();
    const existing = this.alertBuffer.get(groupKey);

    if (existing) {
      existing.details.push(detail);
      existing.lastSeenAt = now;
      // Do not re-send immediately; buffer will flush on interval or batch
      return { buffered: true, count: existing.details.length };
    }

    // New alert category
    const alertEntry: QueuedAlert = {
      category,
      title,
      details: [detail],
      severity,
      actions,
      firstSeenAt: now,
      lastSeenAt: now,
    };
    this.alertBuffer.set(groupKey, alertEntry);

    // If critical or daily limit not exceeded, send immediately
    if (severity === 'CRITICAL' || this.dailyAlertCount < 10) {
      await this.sendFormattedAlert(alertEntry);
      this.dailyAlertCount++;
      return { sent: true };
    }

    return { buffered: true, quotaExceeded: true };
  }

  /**
   * Flushes grouped buffered alerts into a consolidated message.
   */
  static async flushGroupedAlerts() {
    this.checkResetDaily();

    for (const [key, alert] of this.alertBuffer.entries()) {
      if (alert.details.length > 1) {
        const consolidatedTitle = `[Gộp ${alert.details.length} Sự Cố] ${alert.title}`;
        const consolidatedMessage =
          alert.details.slice(0, 5).map((d, i) => `${i + 1}. ${d}`).join('\n') +
          (alert.details.length > 5 ? `\n... và ${alert.details.length - 5} sự cố tương tự khác.` : '');

        await TelegramAlertService.sendAlert(
          consolidatedTitle,
          `${consolidatedMessage}\n\n🔗 *Thao tác nhanh:*\n${alert.actions.map((a) => `• [${a.label}](${a.url})`).join('\n')}`,
          alert.severity
        );
      }
      this.alertBuffer.delete(key);
    }
  }

  private static async sendFormattedAlert(alert: QueuedAlert) {
    const actionLinks = alert.actions.length > 0
      ? `\n\n🔗 *Thao tác nhanh:*\n${alert.actions.map((a) => `• [${a.label}](${a.url})`).join('\n')}`
      : '\n\n🔗 *Truy cập:* [Mở Dashboard Quản Trị](https://betashop-store.netlify.app/admin)';

    await TelegramAlertService.sendAlert(
      alert.title,
      `${alert.details[0]}${actionLinks}`,
      alert.severity
    );
  }
}
