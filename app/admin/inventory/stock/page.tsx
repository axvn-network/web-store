'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Boxes,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Warehouse,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { StockItem } from '@/lib/adminDb';
import { exportToExcel } from '@/lib/excelExport';

export default function StockAdminPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data?slice=stocks')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStocks(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = stocks.filter((s) => {
    const matchSearch =
      s.productName.toLowerCase().includes(search.toLowerCase()) ||
      s.sku.toLowerCase().includes(search.toLowerCase()) ||
      s.barcode.includes(search);

    const matchWarehouse = warehouseFilter === 'all' || s.warehouseId === warehouseFilter;

    let matchStatus = true;
    if (statusFilter === 'danger') {
      matchStatus = s.available <= s.minAlert;
    } else if (statusFilter === 'warning') {
      matchStatus = s.available > s.minAlert && s.available <= s.minAlert * 2;
    } else if (statusFilter === 'good') {
      matchStatus = s.available > s.minAlert * 2;
    }

    return matchSearch && matchWarehouse && matchStatus;
  });

  const handleExport = () => {
    const data = filtered.map((s) => ({
      'Tên Sản Phẩm': s.productName,
      'Quy Cách': s.variantName,
      'Mã SKU': s.sku,
      Barcode: s.barcode,
      'Kho Hàng': s.warehouseName,
      'Tồn Thực Tế': s.quantity,
      'Đang Giữ (Đơn)': s.reserved,
      'Sẵn Sàng Bán': s.available,
      'Định Mức Tối Thiểu': s.minAlert,
      'Giá Vốn': s.costPrice,
      'Giá Bán Lẻ': s.retailPrice,
    }));
    exportToExcel(data, `Ton_Kho_Betashop_${Date.now()}`);
  };

  const totalActual = filtered.reduce((sum, s) => sum + s.quantity, 0);
  const totalAvailable = filtered.reduce((sum, s) => sum + s.available, 0);
  const totalValue = filtered.reduce((sum, s) => sum + s.quantity * s.costPrice, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <span>Tồn Kho Thực Tế & Định Mức Cảnh Báo</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {filtered.length} bản ghi
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Theo dõi tồn kho thực tế, số lượng đang giữ theo đơn và số lượng có thể bán (Available) theo từng kho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel Tồn Kho</span>
          </button>
          <Link
            href="/admin/inventory/imports"
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
          >
            + Lập Phiếu Nhập Kho
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-semibold">Tổng Tồn Kho Thực Tế</p>
          <h3 className="text-xl font-black text-white mt-1">
            {totalActual.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-500">chiếc</span>
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-semibold">Sẵn Sàng Bán (Available)</p>
          <h3 className="text-xl font-black text-emerald-400 mt-1">
            {totalAvailable.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-500">chiếc</span>
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-semibold">Ước Tính Giá Trị Tồn Kho (Giá vốn)</p>
          <h3 className="text-xl font-black text-amber-400 mt-1">
            {formatVND(totalValue)}
          </h3>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm, mã SKU, Barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả chi nhánh kho</option>
              <option value="wh-01">Kho Tổng Hà Nội - Mỹ Đình</option>
              <option value="wh-02">Kho Chi Nhánh TP.HCM - Tân Bình</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả trạng thái định mức</option>
              <option value="danger">🔴 Dưới định mức (Cần nhập gấp)</option>
              <option value="warning">🟡 Sắp hết hàng (&le; 2x định mức)</option>
              <option value="good">🟢 Tồn kho an toàn (&gt; 2x định mức)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Sản Phẩm & Biến Thể</th>
                <th className="p-3">Kho Lưu Trữ</th>
                <th className="p-3">Mã SKU / Barcode</th>
                <th className="p-3 text-center">Tồn Thực Tế</th>
                <th className="p-3 text-center">Đang Giữ</th>
                <th className="p-3 text-center">Có Thể Bán</th>
                <th className="p-3 text-center">Định Mức</th>
                <th className="p-3 text-right">Giá Trị Tồn</th>
                <th className="p-3 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => {
                const isDanger = s.available <= s.minAlert;
                const isWarning = s.available > s.minAlert && s.available <= s.minAlert * 2;

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white text-xs">{s.productName}</div>
                      <div className="text-[11px] text-slate-400">{s.variantName}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-300">
                      {s.warehouseName.replace('Kho ', '')}
                    </td>
                    <td className="p-3 font-mono">
                      <div className="text-emerald-400 font-bold">{s.sku}</div>
                      <div className="text-[10px] text-slate-500">{s.barcode}</div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{s.quantity}</td>
                    <td className="p-3 text-center font-bold text-slate-400">{s.reserved}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                          isDanger
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {s.available}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-400 font-bold">{s.minAlert}</td>
                    <td className="p-3 text-right font-extrabold text-slate-200">
                      {formatVND(s.quantity * s.costPrice)}
                    </td>
                    <td className="p-3 text-center">
                      {isDanger ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                          Cần nhập gấp
                        </span>
                      ) : isWarning ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                          Sắp hết
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          Đủ hàng
                        </span>
                      )}
                    </td>
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
