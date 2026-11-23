'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { StockMovement } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function StockHistoryAdminPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data?slice=stockMovements')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setMovements(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = movements.filter((m) => {
    const matchSearch =
      m.productName.toLowerCase().includes(search.toLowerCase()) ||
      m.movementNo.toLowerCase().includes(search.toLowerCase()) ||
      m.refDocCode.toLowerCase().includes(search.toLowerCase()) ||
      m.warehouseName.toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'all' || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleExport = () => {
    const data = filtered.map((m) => ({
      'Mã Biến Động': m.movementNo,
      'Sản Phẩm': m.productName,
      'Kho Hàng': m.warehouseName,
      'Loại Biến Động': m.typeName,
      'Số Chứng Từ': m.refDocCode,
      'Thay Đổi': m.quantity,
      'Tồn Trước': m.stockBefore,
      'Tồn Sau': m.stockAfter,
      'Người Thực Hiện': m.performedBy,
      'Thời Gian': m.createdAt,
    }));
    exportToExcel(data, `Lich_Su_Bien_Dong_Kho_${Date.now()}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Sổ Nhật Ký Biến Động Tồn Kho</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} giao dịch
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mọi biến động nhập, xuất, chuyển kho, bán hàng và đổi trả đều được ghi nhận dấu vết kiểm toán (Audit Trail).
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Nhật Ký Excel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, mã chứng từ, mã nhật ký..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả loại nghiệp vụ</option>
              <option value="IMPORT">Nhập mua hàng NCC</option>
              <option value="SALE">Xuất bán đơn hàng (Online & POS)</option>
              <option value="TRANSFER">Điều chuyển kho nội bộ</option>
              <option value="EXPORT">Xuất kho thủ công</option>
              <option value="ADJUSTMENT">Cân bằng kiểm kê</option>
              <option value="RETURN">Nhập trả hàng / Đổi trả</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã Nhật Ký</th>
                <th className="p-3">Sản Phẩm & Quy Cách</th>
                <th className="p-3">Kho Hàng</th>
                <th className="p-3">Nghiệp Vụ</th>
                <th className="p-3">Mã Chứng Từ Gốc</th>
                <th className="p-3 text-center">Biến Động</th>
                <th className="p-3 text-center">Tồn Trước</th>
                <th className="p-3 text-center">Tồn Sau</th>
                <th className="p-3">Người Thực Hiện</th>
                <th className="p-3">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((m) => {
                const isPositive = m.quantity > 0;
                return (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-slate-400">{m.movementNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-white text-xs">{m.productName}</div>
                      <div className="text-[10px] text-slate-400">{m.variantName}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      {m.warehouseName.replace('Kho ', '')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                        {m.typeName}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {m.refDocCode}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-0.5 font-black text-xs ${
                          isPositive ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {m.quantity}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-400 font-bold">{m.stockBefore}</td>
                    <td className="p-3 text-center text-white font-black">{m.stockAfter}</td>
                    <td className="p-3 text-slate-300">{m.performedBy}</td>
                    <td className="p-3 text-slate-400">{m.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
