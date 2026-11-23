import { NextResponse } from 'next/server';
import {
  readAdminDb,
  writeAdminDb,
  readAdminDbSlice,
  AdminDatabaseState,
  StockMovement,
  createCategory,
  updateCategory,
  deleteCategory,
  updateProductPricing,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  updateOrderStatus,
  createSupplier,
  createWarehouse,
  createCustomer,
  createCoupon,
  createPromotion,
  approveReview,
  replyReview,
  updateSettings,
  markNotificationRead,
} from '@/lib/adminDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slice = searchParams.get('slice');

    if (slice) {
      const sliceData = await readAdminDbSlice(slice as keyof AdminDatabaseState);
      return NextResponse.json({ success: true, data: sliceData });
    }

    const db = await readAdminDb();
    return NextResponse.json({ success: true, data: db });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      // 0. CATEGORIES (DIRECT SUPABASE PERSISTENCE)
      case 'create_category': {
        const cat = await createCategory(payload);
        return NextResponse.json({ success: true, data: cat }, { status: 201 });
      }

      case 'update_category': {
        const cat = await updateCategory(payload.id, payload);
        return NextResponse.json({ success: true, data: cat });
      }

      case 'delete_category': {
        const res = await deleteCategory(payload.id);
        return NextResponse.json(res);
      }

      // 1. PRODUCTS & PRICING
      case 'update_product_pricing': {
        const updated = await updateProductPricing(
          payload.id,
          payload.customPrice,
          payload.markupPercent,
          payload.status
        );
        return NextResponse.json({ success: true, data: updated });
      }

      case 'create_product': {
        const newProduct = await createProduct(payload);
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
      }

      case 'update_product': {
        const updated = await updateProduct(payload.id, payload);
        return NextResponse.json({ success: true, data: updated });
      }

      case 'delete_product': {
        const res = await deleteProduct(payload.id);
        return NextResponse.json(res);
      }

      // 2. ORDERS & POS
      case 'create_order': {
        const newOrder = await createOrder(payload);
        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
      }

      case 'update_order_status': {
        await updateOrderStatus(payload.orderId || payload.id, payload.status);
        return NextResponse.json({ success: true });
      }

      // 3. INVENTORY: IMPORTS (Phiếu nhập kho)
      case 'create_import_voucher': {
        const db = await readAdminDb();
        const id = `imp-${Date.now()}`;
        const code = `PNK-202611-${String(db.importVouchers.length + 1).padStart(3, '0')}`;
        const newVoucher = {
          ...payload,
          id,
          code,
          status: 'COMPLETED' as const,
          statusText: 'Đã hoàn thành',
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.importVouchers = [newVoucher, ...db.importVouchers];

        if (payload.items && payload.items.length > 0) {
          payload.items.forEach((item: any) => {
            const stockIndex = db.stocks.findIndex(
              (s) => s.variantId === item.variantId && s.warehouseId === payload.warehouseId
            );
            if (stockIndex > -1) {
              const currentStock = db.stocks[stockIndex];
              const before = currentStock.quantity;
              const addQty = Number(item.quantity || 0);
              currentStock.quantity += addQty;
              currentStock.available += addQty;

              const mov: StockMovement = {
                id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                movementNo: `LOG-2611-${Math.floor(1000 + Math.random() * 9000)}`,
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName || 'Bản Tiêu Chuẩn',
                warehouseId: payload.warehouseId,
                warehouseName: payload.warehouseName,
                type: 'IMPORT',
                typeName: 'Nhập mua hàng NCC',
                refDocType: 'ImportVoucher',
                refDocCode: code,
                quantity: addQty,
                stockBefore: before,
                stockAfter: currentStock.quantity,
                performedBy: payload.createdBy || 'Quản lý kho',
                note: `Nhập theo phiếu #${code} từ ${payload.supplierName}`,
                createdAt: new Date().toLocaleString('vi-VN'),
              };
              db.stockMovements = [mov, ...db.stockMovements];
            }
          });
        }

        if (payload.debtAmount > 0) {
          const supIdx = db.suppliers.findIndex((s) => s.id === payload.supplierId);
          if (supIdx > -1) {
            db.suppliers[supIdx].totalImport += payload.totalAmount;
            db.suppliers[supIdx].totalPaid += payload.paidAmount;
            db.suppliers[supIdx].balanceDue += payload.debtAmount;
          }
        }

        writeAdminDb(db);
        return NextResponse.json({ success: true, data: newVoucher });
      }

      // 4. INVENTORY: EXPORTS (Phiếu xuất kho)
      case 'create_export_voucher': {
        const db = await readAdminDb();
        const id = `exp-${Date.now()}`;
        const code = `PXK-202611-${String(db.exportVouchers.length + 1).padStart(3, '0')}`;
        const newVoucher = {
          ...payload,
          id,
          code,
          status: 'COMPLETED' as const,
          reasonText: payload.reasonText || payload.reason,
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.exportVouchers = [newVoucher, ...db.exportVouchers];

        if (payload.items && payload.items.length > 0) {
          payload.items.forEach((item: any) => {
            const stockIndex = db.stocks.findIndex(
              (s) => s.variantId === item.variantId && s.warehouseId === payload.warehouseId
            );
            if (stockIndex > -1) {
              const currentStock = db.stocks[stockIndex];
              const before = currentStock.quantity;
              const subQty = Number(item.quantity || 0);
              currentStock.quantity = Math.max(0, before - subQty);
              currentStock.available = Math.max(0, currentStock.quantity - currentStock.reserved);

              const mov: StockMovement = {
                id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
                movementNo: `LOG-2611-${Math.floor(1000 + Math.random() * 9000)}`,
                variantId: item.variantId,
                productName: item.productName,
                variantName: item.variantName || 'Tiêu chuẩn',
                warehouseId: payload.warehouseId,
                warehouseName: payload.warehouseName,
                type: 'EXPORT',
                typeName: 'Xuất kho thủ công',
                refDocType: 'ExportVoucher',
                refDocCode: code,
                quantity: -subQty,
                stockBefore: before,
                stockAfter: currentStock.quantity,
                performedBy: payload.createdBy || 'Thủ kho',
                note: `Lý do: ${payload.reasonText || payload.reason}`,
                createdAt: new Date().toLocaleString('vi-VN'),
              };
              db.stockMovements = [mov, ...db.stockMovements];
            }
          });
        }

        writeAdminDb(db);
        return NextResponse.json({ success: true, data: newVoucher });
      }

      // 5. INVENTORY: TRANSFERS (Chuyển kho)
      case 'create_transfer_voucher': {
        const db = await readAdminDb();
        const id = `trf-${Date.now()}`;
        const code = `PCK-202611-${String(db.transferVouchers.length + 1).padStart(3, '0')}`;
        const newVoucher = {
          ...payload,
          id,
          code,
          status: 'RECEIVED' as const,
          statusText: 'Đã nhận đủ',
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.transferVouchers = [newVoucher, ...db.transferVouchers];

        if (payload.items && payload.items.length > 0) {
          payload.items.forEach((item: any) => {
            const qty = Number(item.quantity || 0);
            const srcIdx = db.stocks.findIndex(
              (s) => s.variantId === item.variantId && s.warehouseId === payload.fromWarehouseId
            );
            if (srcIdx > -1) {
              db.stocks[srcIdx].quantity = Math.max(0, db.stocks[srcIdx].quantity - qty);
              db.stocks[srcIdx].available = Math.max(0, db.stocks[srcIdx].quantity - db.stocks[srcIdx].reserved);
            }
            const dstIdx = db.stocks.findIndex(
              (s) => s.variantId === item.variantId && s.warehouseId === payload.toWarehouseId
            );
            if (dstIdx > -1) {
              db.stocks[dstIdx].quantity += qty;
              db.stocks[dstIdx].available += qty;
            }
          });
        }

        writeAdminDb(db);
        return NextResponse.json({ success: true, data: newVoucher });
      }

      // 6. INVENTORY: ADJUSTMENTS (Kiểm kê kho)
      case 'create_adjustment': {
        const db = await readAdminDb();
        const id = `adj-${Date.now()}`;
        const code = `PKK-202611-${String(db.adjustments.length + 1).padStart(3, '0')}`;
        const newVoucher = {
          ...payload,
          id,
          code,
          status: 'COMPLETED' as const,
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.adjustments = [newVoucher, ...db.adjustments];

        if (payload.items && payload.items.length > 0) {
          payload.items.forEach((item: any) => {
            const stockIndex = db.stocks.findIndex(
              (s) => s.variantId === item.variantId && s.warehouseId === payload.warehouseId
            );
            if (stockIndex > -1) {
              db.stocks[stockIndex].quantity = Number(item.realQuantity || 0);
              db.stocks[stockIndex].available = Math.max(0, db.stocks[stockIndex].quantity - db.stocks[stockIndex].reserved);
            }
          });
        }

        writeAdminDb(db);
        return NextResponse.json({ success: true, data: newVoucher });
      }

      // 7. RETURNS (Đổi trả hàng)
      case 'create_return_voucher': {
        const db = await readAdminDb();
        const id = `ret-${Date.now()}`;
        const code = `PTH-202611-${String(db.returns.length + 1).padStart(3, '0')}`;
        const newVoucher = {
          ...payload,
          id,
          code,
          status: 'COMPLETED' as const,
          createdAt: new Date().toLocaleString('vi-VN'),
        };
        db.returns = [newVoucher, ...db.returns];

        if (payload.restockType === 'RESTOCK_USABLE' && payload.items) {
          payload.items.forEach((item: any) => {
            const stockIdx = db.stocks.findIndex((s) => s.variantId === item.variantId);
            if (stockIdx > -1) {
              const qty = Number(item.quantity || 1);
              db.stocks[stockIdx].quantity += qty;
              db.stocks[stockIdx].available += qty;
            }
          });
        }

        writeAdminDb(db);
        return NextResponse.json({ success: true, data: newVoucher });
      }

      // 8. SUPPLIERS
      case 'create_supplier': {
        const newSupplier = await createSupplier(payload);
        return NextResponse.json({ success: true, data: newSupplier }, { status: 201 });
      }

      // 9. WAREHOUSES
      case 'create_warehouse': {
        const newWh = await createWarehouse(payload);
        return NextResponse.json({ success: true, data: newWh }, { status: 201 });
      }

      // 10. CUSTOMERS
      case 'create_customer': {
        const newCustomer = await createCustomer(payload);
        return NextResponse.json({ success: true, data: newCustomer }, { status: 201 });
      }

      // 11. COUPONS & PROMOTIONS
      case 'create_coupon': {
        const newCoupon = await createCoupon(payload);
        return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
      }

      case 'create_promotion': {
        const newPromo = await createPromotion(payload);
        return NextResponse.json({ success: true, data: newPromo }, { status: 201 });
      }

      // 12. REVIEWS
      case 'approve_review': {
        await approveReview(payload.id);
        return NextResponse.json({ success: true });
      }

      case 'reply_review': {
        await replyReview(payload.id, payload.reply);
        return NextResponse.json({ success: true });
      }

      // 13. SETTINGS
      case 'update_settings': {
        const updatedSettings = await updateSettings(payload);
        return NextResponse.json({ success: true, data: updatedSettings });
      }

      // 14. NOTIFICATIONS
      case 'mark_notification_read': {
        await markNotificationRead(payload.id);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ success: false, error: `Hành động không xác định: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
