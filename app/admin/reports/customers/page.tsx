'use client';

import React, { useState, useEffect } from 'react';
import { Users, Download } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Customer } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function CustomersReportPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?slice=customers')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setCustomers(res.data);
        }
      });
  }, []);

  const sorted = [...customers].sort((a, b) => b.totalSpent - a.totalSpent);

  const handleExport = () => {
    const data = sorted.map((c, idx) => ({
      Hạng: idx + 1,
      'Họ Và Tên': c.name,
      'Số Điện Thoại': c.phone,
      'Hạng VIP': c.rankText,
      'Tổng Chi Tiêu': c.totalSpent,
      'Số Đơn Đã Mua': c.orderCount,
      'Điểm Tích Lũy': c.points,
    }));
    exportToExcel(data, `Bao_Cao_Top_Khach_Hang_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Báo Cáo Phân Khúc & Chi Tiêu Khách Hàng</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xếp hạng các khách hàng VIP có giá trị vòng đời (LTV) cao nhất của tổng kho.
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

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3 w-12 text-center">Top</th>
              <th className="p-3">Họ Tên Khách Hàng</th>
              <th className="p-3">Số Điện Thoại</th>
              <th className="p-3">Phân Hạng</th>
              <th className="p-3 text-center">Số Đơn Hàng</th>
              <th className="p-3 text-right">Tổng Tiền Đã Mua</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.map((c, idx) => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="p-3 text-center font-bold text-slate-400">#{idx + 1}</td>
                <td className="p-3 font-semibold text-white">{c.name}</td>
                <td className="p-3 text-slate-300">{c.phone}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                    {c.rankText}
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-slate-300">{c.orderCount} đơn</td>
                <td className="p-3 text-right font-black text-emerald-400">
                  {formatVND(c.totalSpent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
