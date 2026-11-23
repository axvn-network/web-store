'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Upload,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Lock,
} from 'lucide-react';

interface ProductOption {
  id: string;
  name: string;
  sku: string;
}

export default function AdminStockPage() {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [stockSummary, setStockSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Import form state
  const [importProductId, setImportProductId] = useState('');
  const [rawKeysText, setRawKeysText] = useState('');
  const [batchId, setBatchId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importReport, setImportReport] = useState<any>(null);

  // Fetch product list for dropdown
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d.products || d.data || [];
        setProducts(list.slice(0, 50));
        if (list.length > 0) {
          setSelectedProductId(list[0].id);
          setImportProductId(list[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const fetchStock = async (prodId: string) => {
    if (!prodId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stock?productId=${encodeURIComponent(prodId)}`);
      const data = await res.json();
      if (data.success) {
        setStockSummary(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      fetchStock(selectedProductId);
    }
  }, [selectedProductId]);

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importProductId || !rawKeysText.trim()) return;

    setImporting(true);
    setImportReport(null);

    try {
      const res = await fetch('/api/admin/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: importProductId,
          rawKeys: rawKeysText,
          batchId: batchId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportReport(data.data);
        setRawKeysText('');
        if (importProductId === selectedProductId) {
          fetchStock(selectedProductId);
        }
      } else {
        alert(data.error || 'Lỗi khi nhập kho key');
      }
    } catch (err: any) {
      alert('Lỗi kết nối: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Quản Lý Kho Key & Tài Khoản Số (Atomic Stock)</h1>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full">
              Chống Bán Trùng (Atomic)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị tồn kho mã key, tài khoản số. Tự động mã hóa AES-256-GCM trước khi lưu DB, chống trùng lặp qua hash SHA-256, phân bổ nguyên tử (atomic) chống race condition.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchStock(selectedProductId)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-950/40 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập Key Hàng Loạt</span>
          </button>
        </div>
      </div>

      {/* Product Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Chọn sản phẩm kiểm tra kho:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 flex-1 max-w-md"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        {stockSummary && (
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Khả dụng: <strong>{stockSummary.available}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Clock className="w-4 h-4" />
              <span>Đã giao: <strong>{stockSummary.delivered}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Layers className="w-4 h-4" />
              <span>Tổng: <strong>{stockSummary.total}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Keys Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-orange-400" />
            <span>Danh Sách Key Đã Mã Hóa & Phân Bổ</span>
          </h2>
          <span className="text-xs text-slate-400">Dữ liệu thô chỉ giải mã khi giao khách</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Mã Key (Masked)</th>
                <th className="py-3 px-4">Lô hàng (Batch ID)</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian tạo</th>
                <th className="py-3 px-4">Thời gian giao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stockSummary?.recentItems?.length > 0 ? (
                stockSummary.recentItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{item.maskedKey}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {item.batchId || 'Mặc định'}
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'available' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Sẵn sàng bán
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                          Đã giao khách
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {item.deliveredAt ? new Date(item.deliveredAt).toLocaleString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Sản phẩm này hiện chưa có key nào trong kho nội bộ. Nhấn &ldquo;Nhập Key Hàng Loạt&rdquo; để thêm lô hàng mới.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" />
                <span>Nhập Key / Tài Khoản Hàng Loạt (Bulk Import)</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBulkImport} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sản phẩm đích*</label>
                <select
                  value={importProductId}
                  onChange={(e) => setImportProductId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mã Lô Hàng (Batch ID - tùy chọn)</label>
                <input
                  type="text"
                  placeholder="vd: BATCH-VIP-202611-01"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Danh sách Key / Account* (Mỗi dòng một key - Tự động mã hóa AES-256-GCM)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder={`KEY-A1B2-C3D4-E5F6\nKEY-7890-ABCD-EF01\nuser123|pass456|2fa_secret`}
                  value={rawKeysText}
                  onChange={(e) => setRawKeysText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {importReport && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-400">
                    ✓ Đã nhập thành công {importReport.successCount}/{importReport.totalLines} keys.
                  </div>
                  {importReport.duplicateCount > 0 && (
                    <div className="text-amber-400">
                      ⚠️ Bỏ qua {importReport.duplicateCount} keys do trùng lặp (SHA-256 hash check).
                    </div>
                  )}
                  {importReport.errorCount > 0 && (
                    <div className="text-red-400">❌ {importReport.errorCount} dòng lỗi.</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold"
                >
                  {importing ? 'Đang mã hóa & lưu...' : 'Nhập & Mã Hóa Lưu Trữ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
