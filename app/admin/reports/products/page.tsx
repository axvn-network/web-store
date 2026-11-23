'use client';

import React, { useState, useEffect } from 'react';
import { Package, Download } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { Product } from '@/data/storeData';
import { exportToExcel } from '@/lib/excelExport';

export default function ProductsReportPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?slice=products')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      });
  }, []);

  const sortedBySold = [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0));

  const handleExport = () => {
    const data = sortedBySold.map((p, idx) => ({
      Hạng: idx + 1,
      'Tên Sản Phẩm': p.title,
      'Danh Mục': p.category,
      'Thương Hiệu': p.brand,
      'Đã Bán': p.sold || 0,
      'Đơn Giá': p.price,
      'Doanh Số Thu Về': (p.sold || 0) * p.price,
    }));
    exportToExcel(data, `Bao_Cao_San_Pham_Ban_Chay_${Date.now()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Báo Cáo Hiệu Quả Sản Phẩm Gia Dụng</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Xếp hạng sản phẩm bán chạy nhất, doanh số đóng góp và vòng quay sản phẩm.
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
              <th className="p-3">Sản Phẩm</th>
              <th className="p-3">Danh Mục</th>
              <th className="p-3 text-center">Số Lượng Đã Bán</th>
              <th className="p-3 text-right">Đơn Giá</th>
              <th className="p-3 text-right">Tổng Doanh Số</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedBySold.map((p, idx) => (
              <tr key={p.id} className="hover:bg-slate-800/40">
                <td className="p-3 text-center font-bold text-slate-400">#{idx + 1}</td>
                <td className="p-3 font-semibold text-white">{p.title}</td>
                <td className="p-3 text-slate-300">{p.category}</td>
                <td className="p-3 text-center font-bold text-emerald-400">{p.sold || 0} chiếc</td>
                <td className="p-3 text-right text-slate-300">{formatVND(p.price)}</td>
                <td className="p-3 text-right font-black text-white">
                  {formatVND((p.sold || 0) * p.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
