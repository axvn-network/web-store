'use client';

import React, { useState, useEffect } from 'react';
import { Boxes, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { StockItem } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function InventoryReportPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?slice=stocks')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStocks(res.data);
        }
      });
  }, []);

  const totalValue = stocks.reduce((sum, s) => sum + s.quantity * s.costPrice, 0);
  const totalActual = stocks.reduce((sum, s) => sum + s.quantity, 0);

  const handleExport = () => {
    const data = stocks.map((s) => ({
      'Sản Phẩm': s.productName,
      Kho: s.warehouseName,
      'Số Lượng Tồn': s.quantity,
      'Giá Vốn': s.costPrice,
      'Tổng Giá Trị Tồn': s.quantity * s.costPrice,
      'Tình Trạng': s.available <= s.minAlert ? 'Cần nhập gấp' : 'Đủ hàng',
    }));
    exportToExcel(data, `Bao_Cao_Gia_Tri_Ton_Kho_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span>Báo Cáo Định Giá Tồn Kho Đa Chi Nhánh</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tổng hợp giá trị vốn lưu động đang nằm trong kho hàng gia dụng Hà Nội & TP.HCM.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Báo Cáo Excel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Tổng Số Lượng Tồn Kho</span>
          <h3 className="text-2xl font-black text-white">{totalActual.toLocaleString('vi-VN')} chiếc</h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Tổng Giá Trị Vốn Lưu Động</span>
          <h3 className="text-2xl font-black text-emerald-400">{formatVND(totalValue)}</h3>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Sản Phẩm</th>
              <th className="p-3">Kho Lưu Trữ</th>
              <th className="p-3 text-center">Tồn Kho</th>
              <th className="p-3 text-right">Đơn Giá Vốn</th>
              <th className="p-3 text-right">Tổng Giá Trị</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {stocks.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">{s.productName}</td>
                <td className="p-3 text-slate-300">{s.warehouseName}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{s.quantity}</td>
                <td className="p-3 text-right text-slate-400">{formatVND(s.costPrice)}</td>
                <td className="p-3 text-right font-black text-white">
                  {formatVND(s.quantity * s.costPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
