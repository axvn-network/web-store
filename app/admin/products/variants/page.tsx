'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  Plus,
  Search,
  Download,
  Boxes,
  Barcode,
  Edit,
  Trash2,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ProductVariant } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function VariantsAdminPage() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data?slice=variants')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setVariants(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = variants.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.barcode.includes(search)
  );

  const handleExport = () => {
    const data = filtered.map((v) => ({
      'Mã Biến Thể': v.id,
      'Tên Biến Thể': v.name,
      SKU: v.sku,
      Barcode: v.barcode,
      'Điện Áp': v.voltage || '220V',
      'Giá Nhập': v.costPrice,
      'Giá Bán Lẻ': v.retailPrice,
    }));
    exportToExcel(data, `Danh_Sach_Bien_The_Gia_Dung_${Date.now()}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Ma Trận Biến Thể Đồ Gia Dụng</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {filtered.length} biến thể
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý quy cách dung tích (1.8L, 6.2L), công suất (1500W, 2000W), điện áp (220V/110V), mã SKU & Barcode.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên biến thể, mã SKU hoặc Barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Variants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Tên Biến Thể Quy Cách</th>
                <th className="p-3">Mã SKU</th>
                <th className="p-3">Mã Vạch Barcode</th>
                <th className="p-3 text-center">Điện Áp</th>
                <th className="p-3 text-right">Giá Vốn Nhập</th>
                <th className="p-3 text-right">Giá Bán Lẻ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-semibold text-white">{v.name}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{v.sku}</td>
                  <td className="p-3 font-mono text-slate-300 flex items-center gap-1.5">
                    <Barcode className="w-4 h-4 text-slate-400" />
                    <span>{v.barcode}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {v.voltage || '220V'}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-medium">
                    {formatVND(v.costPrice)}
                  </td>
                  <td className="p-3 text-right font-extrabold text-emerald-400">
                    {formatVND(v.retailPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
