import { NextResponse } from 'next/server';
import { readCustomerDb, writeCustomerDb, CustomerAddress } from '@/lib/customerDb';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr-01';
    const db = readCustomerDb();

    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const addresses = db.addresses.filter((a) => a.userId === user.id);
    const reviews = db.reviews.filter((r) => r.userId === user.id);
    const vouchers = db.vouchers;
    const wishlist = db.wishlist.filter((w) => w.userId === user.id);
    const affiliate = db.affiliates.find((a) => a.userId === user.id);

    return NextResponse.json({
      success: true,
      data: {
        user,
        addresses,
        reviews,
        vouchers,
        wishlist,
        affiliate,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, userId = 'usr-01' } = body;
    const db = readCustomerDb();

    switch (action) {
      // 1. UPDATE PROFILE
      case 'update_profile': {
        const idx = db.users.findIndex((u) => u.id === userId);
        if (idx > -1) {
          db.users[idx] = { ...db.users[idx], ...payload };
          writeCustomerDb(db);
          return NextResponse.json({ success: true, user: db.users[idx] });
        }
        return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng' }, { status: 404 });
      }

      // 2. CREATE ADDRESS
      case 'create_address': {
        const newAddress: CustomerAddress = {
          id: `addr-${Date.now()}`,
          userId,
          name: payload.name,
          phone: payload.phone,
          province: payload.province,
          district: payload.district,
          ward: payload.ward,
          detail: payload.detail,
          type: payload.type || 'HOME',
          isDefault: !!payload.isDefault,
        };
        if (newAddress.isDefault) {
          db.addresses = db.addresses.map((a) => (a.userId === userId ? { ...a, isDefault: false } : a));
        }
        db.addresses.unshift(newAddress);
        writeCustomerDb(db);
        return NextResponse.json({ success: true, data: newAddress });
      }

      // 3. DELETE ADDRESS
      case 'delete_address': {
        db.addresses = db.addresses.filter((a) => a.id !== payload.id);
        writeCustomerDb(db);
        return NextResponse.json({ success: true });
      }

      // 4. SET DEFAULT ADDRESS
      case 'set_default_address': {
        db.addresses = db.addresses.map((a) => {
          if (a.userId === userId) {
            return { ...a, isDefault: a.id === payload.id };
          }
          return a;
        });
        writeCustomerDb(db);
        return NextResponse.json({ success: true });
      }

      // 5. TOGGLE WISHLIST
      case 'toggle_wishlist': {
        const exists = db.wishlist.some((w) => w.userId === userId && w.productId === payload.productId);
        if (exists) {
          db.wishlist = db.wishlist.filter((w) => !(w.userId === userId && w.productId === payload.productId));
        } else {
          db.wishlist.push({ userId, productId: payload.productId, addedAt: new Date().toLocaleDateString('vi-VN') });
        }
        writeCustomerDb(db);
        return NextResponse.json({ success: true, inWishlist: !exists });
      }

      // 6. SUBMIT REVIEW
      case 'submit_review': {
        const newReview = {
          id: `rev-${Date.now()}`,
          userId,
          productId: payload.productId,
          productTitle: payload.productTitle,
          productImage: payload.productImage,
          rating: Number(payload.rating || 5),
          comment: payload.comment,
          images: payload.images || [],
          status: 'APPROVED' as const, // auto-approve for demonstration
          createdAt: new Date().toLocaleDateString('vi-VN'),
        };
        db.reviews.unshift(newReview);
        writeCustomerDb(db);
        return NextResponse.json({ success: true, data: newReview });
      }

      default:
        return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
