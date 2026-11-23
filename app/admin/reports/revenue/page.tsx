'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  Store,
  Globe,
  CloudUpload,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatVND } from '@/lib/utils';
import { exportToExcel } from '@/lib/excelExport';

const REVENUE_BY_MONTH = [
  { thang: 'T5/2026', doanhThu: 145000000, giaVon: 104000000, laiGop: 41000000 },
  { thang: 'T6/2026', doanhThu: 182000000, giaVon: 131000000, laiGop: 51000000 },
  { thang: 'T7/2026', doanhThu: 215000000, giaVon: 154000000, laiGop: 61000000 },
  { thang: 'T8/2026', doanhThu: 198000000, giaVon: 142000000, laiGop: 56000000 },
  { thang: 'T9/2026', doanhThu: 245000000, giaVon: 176000000, laiGop: 69000000 },
  { thang: 'T10/2026', doanhThu: 310000000, giaVon: 223000000, laiGop: 87000000 },
  { thang: 'T11/2026 (Nay)', doanhThu: 385000000, giaVon: 277000000, laiGop: 108000000 },
];

export default function RevenueReportPage() {
  const [channelFilter, setChannelFilter] = useState('all');

  const totalRevenue = 385000000;
  const totalCost = 277000000;
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);

  const handleExport = () => {
    const data = REVENUE_BY_MONTH.map((r) => ({
      Tháng: r.thang,
      'Tổng Doanh Thu': r.doanhThu,
      'Giá Vốn Hàng Bán (COGS)': r.giaVon,
      'Lợi Nhuận Gộp': r.laiGop,
      'Tỷ Suất Lãi Gộp (%)': `${Math.round((r.laiGop / r.doanhThu) * 100)}%`,
    }));
    exportToExcel(data, `Bao_Cao_Doanh_Thu_Loi_Nhuan_${Date.now()}`);
  };

  const handleExportGoogleDrive = () => {
    handleExport();
    window.open('https://drive.google.com/drive/u/0/my-drive', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Báo Cáo Doanh Thu & Lợi Nhuận Gộp</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Báo cáo phân tích doanh thu bán hàng, giá vốn xuất kho (COGS) và biên lợi nhuận thuần.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportGoogleDrive}
            title="Đồng bộ và lưu trữ báo cáo lên Google Drive"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded-lg text-xs font-semibold transition"
          >
            <CloudUpload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xuất Lên Google Drive</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Doanh Thu Tháng Này</span>
          <h3 className="text-2xl font-black text-white">{formatVND(totalRevenue)}</h3>
          <span className="text-[11px] text-emerald-400 font-bold block">+24.2% so với tháng trước</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Giá Vốn Hàng Bán</span>
          <h3 className="text-2xl font-black text-slate-300">{formatVND(totalCost)}</h3>
          <span className="text-[11px] text-slate-400 block">71.9% trên tổng doanh thu</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Lợi Nhuận Gộp</span>
          <h3 className="text-2xl font-black text-emerald-400">{formatVND(grossProfit)}</h3>
          <span className="text-[11px] text-emerald-400 font-bold block">Biên lãi gộp: {profitMargin}%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Kênh POS / Online</span>
          <h3 className="text-2xl font-black text-blue-400">42% / 58%</h3>
          <span className="text-[11px] text-slate-400 block">Cân bằng đa kênh</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm sm:text-base">
            Biểu Đồ Tăng Trưởng Doanh Thu & Lợi Nhuận (6 Tháng)
          </h3>
          <span className="text-xs font-bold text-slate-400">Đơn vị: Triệu VNĐ</span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_BY_MONTH} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="thang" stroke="#94a3b8" fontSize={11} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `${Math.round(val / 1000000)}M`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                formatter={(val: any) => [formatVND(Number(val)), '']}
              />
              <Legend />
              <Bar dataKey="doanhThu" fill="#3b82f6" name="Doanh Thu" radius={[4, 4, 0, 0]} />
              <Bar dataKey="giaVon" fill="#64748b" name="Giá Vốn (COGS)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laiGop" fill="#10b981" name="Lợi Nhuận Gộp" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
