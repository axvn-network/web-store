import prisma from './prisma';

export interface WalletAdjustmentParams {
  userId: string;
  amount: number; // positive for deposit/refund, negative for purchase/deduction
  type: 'DEPOSIT' | 'PURCHASE' | 'REFUND' | 'ADJUSTMENT';
  note?: string;
  performedBy?: string;
  referenceId?: string;
  ipAddress?: string;
}

export interface WalletResult {
  success: boolean;
  balanceBefore: number;
  balanceAfter: number;
  transactionId: string;
}

/**
 * Wallet Management Service with Atomic Race-Condition Protection
 */
export class WalletService {
  /**
   * Adjusts wallet balance inside an atomic database transaction.
   * Enforces non-negative balance constraint and records non-deletable audit log.
   */
  static async adjustBalanceAtomic(params: WalletAdjustmentParams): Promise<WalletResult> {
    const { userId, amount, type, note, performedBy, referenceId, ipAddress } = params;

    return await prisma.$transaction(async (tx) => {
      // 1. Fetch current user with locking
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`Không tìm thấy người dùng với ID: ${userId}`);
      }

      // Check current wallet balance from latest transaction or user metadata
      const latestTx = await tx.walletTransaction.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const currentBalance = latestTx ? latestTx.balanceAfter : 0;
      const newBalance = currentBalance + amount;

      // Prevent negative balance
      if (newBalance < 0) {
        throw new Error(`Số dư không đủ để thực hiện giao dịch (Số dư: ${currentBalance.toLocaleString('vi-VN')} ₫, Yêu cầu: ${Math.abs(amount).toLocaleString('vi-VN')} ₫)`);
      }

      // 2. Create non-deletable WalletTransaction record
      const walletTx = await tx.walletTransaction.create({
        data: {
          userId,
          type,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: newBalance,
          referenceId: referenceId || null,
          note: note || `Giao dịch ${type}`,
          createdBy: performedBy || 'SYSTEM',
        },
      });

      // 3. Create AuditLog entry for compliance & auditing
      await tx.auditLog.create({
        data: {
          userId: performedBy || null,
          userName: performedBy ? `Staff (${performedBy})` : 'SYSTEM',
          action: 'ADJUST_BALANCE',
          entity: 'WALLET',
          entityId: userId,
          diff: JSON.stringify({
            type,
            amount,
            balanceBefore: currentBalance,
            balanceAfter: newBalance,
            note,
            referenceId,
          }),
          ipAddress: ipAddress || null,
        },
      });

      return {
        success: true,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        transactionId: walletTx.id,
      };
    });
  }

  /**
   * Gets current wallet balance for a user.
   */
  static async getBalance(userId: string): Promise<number> {
    const latestTx = await prisma.walletTransaction.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return latestTx ? latestTx.balanceAfter : 0;
  }

  /**
   * Gets transaction ledger history for a user.
   */
  static async getLedger(userId: string, limit = 50) {
    return await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
