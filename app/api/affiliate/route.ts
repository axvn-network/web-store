import { NextResponse } from 'next/server';
import { readCustomerDb, writeCustomerDb, AffiliateProfile, AffiliateLink, WithdrawalRequest } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr-02';
    const db = readCustomerDb();

    let affiliate = db.affiliates.find((a) => a.userId === userId);
    if (!affiliate && db.affiliates.length > 0) {
      affiliate = db.affiliates[0];
    }

    if (!affiliate) {
      return NextResponse.json({ success: true, isAffiliate: false });
    }

    const links = db.affiliateLinks.filter((l) => l.affiliateId === affiliate!.id);
    const referrals = db.affiliateReferrals.filter((r) => r.affiliateId === affiliate!.id);
    const withdrawals = db.withdrawals.filter((w) => w.affiliateId === affiliate!.id);

    return NextResponse.json({
      success: true,
      isAffiliate: true,
      affiliate,
      links,
      referrals,
      withdrawals,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, userId = 'usr-02' } = body;
    const db = readCustomerDb();

    switch (action) {
      // 1. REGISTER AS CTV
      case 'register_affiliate': {
        const existing = db.affiliates.find((a) => a.userId === userId);
        if (existing) {
          return NextResponse.json({ success: true, affiliate: existing });
        }

        const code = (payload.code || `CTV-${Date.now().toString(36).toUpperCase()}`).toUpperCase();
        const newAff: AffiliateProfile = {
          id: `aff-${Date.now()}`,
          userId,
          code,
          status: 'approved', // Auto-approved for smooth demonstration
          channel: payload.channel || 'Mạng xã hội',
          channelUrl: payload.channelUrl || '',
          followers: payload.followers || '1.000+',
          note: payload.note || '',
          commissionRate: 7, // 7% base
          availableBalance: 0,
          pendingBalance: 0,
          totalWithdrawn: 0,
          totalClicks: 0,
          totalOrders: 0,
          totalRevenue: 0,
          approvedAt: new Date().toLocaleDateString('vi-VN'),
          createdAt: new Date().toLocaleString('vi-VN'),
        };

        // Create default tracking link
        const defaultLink: AffiliateLink = {
          id: `afflink-${Date.now()}`,
          affiliateId: newAff.id,
          code: newAff.code,
          label: 'Link mặc định trang chủ',
          targetUrl: `/?ref=${newAff.code}`,
          clicks: 0,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        db.affiliates.unshift(newAff);
        db.affiliateLinks.unshift(defaultLink);

        // Update user role to affiliate
        const uIdx = db.users.findIndex((u) => u.id === userId);
        if (uIdx > -1) {
          db.users[uIdx].role = 'affiliate';
        }

        writeCustomerDb(db);
        return NextResponse.json({ success: true, affiliate: newAff });
      }

      // 2. CREATE TRACKING LINK
      case 'create_link': {
        const affiliate = db.affiliates.find((a) => a.userId === userId) || db.affiliates[0];
        if (!affiliate) {
          return NextResponse.json({ success: false, error: 'Chưa có hồ sơ CTV.' }, { status: 400 });
        }

        const linkCode = `${affiliate.code}-${(payload.slug || Date.now().toString(36)).toUpperCase()}`;
        const newLink: AffiliateLink = {
          id: `afflink-${Date.now()}`,
          affiliateId: affiliate.id,
          code: linkCode,
          label: payload.label || 'Chiến dịch sản phẩm',
          targetUrl: `${payload.targetUrl || '/'}?ref=${linkCode}`,
          clicks: 0,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        db.affiliateLinks.unshift(newLink);
        writeCustomerDb(db);
        return NextResponse.json({ success: true, data: newLink });
      }

      // 3. REQUEST WITHDRAWAL
      case 'request_withdrawal': {
        const affiliate = db.affiliates.find((a) => a.userId === userId) || db.affiliates[0];
        if (!affiliate) {
          return NextResponse.json({ success: false, error: 'Chưa có hồ sơ CTV.' }, { status: 400 });
        }

        const amount = Number(payload.amount || 0);
        if (amount < 200000) {
          return NextResponse.json(
            { success: false, error: 'Số tiền rút tối thiểu là 200.000 ₫.' },
            { status: 400 }
          );
        }

        if (amount > affiliate.availableBalance) {
          return NextResponse.json(
            { success: false, error: 'Số dư khả dụng không đủ để thực hiện lệnh rút tiền này.' },
            { status: 400 }
          );
        }

        // Deduct available balance
        affiliate.availableBalance -= amount;

        const wdr: WithdrawalRequest = {
          id: `wdr-${Date.now()}`,
          affiliateId: affiliate.id,
          amount,
          method: payload.method || 'BANK',
          bankName: payload.bankName,
          bankAccount: payload.bankAccount,
          accountName: payload.accountName,
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };

        db.withdrawals.unshift(wdr);
        writeCustomerDb(db);

        return NextResponse.json({ success: true, data: wdr });
      }

      default:
        return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
