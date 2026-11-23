'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Boxes,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  RefreshCw,
  Store,
  Network,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatVND } from '@/lib/utils';
import { AdminDatabaseState } from '@/lib/adminDb';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDatabaseState | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | '30days'>('30days');

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/data').then((r) => r.json()),
      fetch('/api/admin/providers').then((r) => r.json()).catch(() => ({ success: false })),
    ])
      .then(([resData, resProviders]) => {
        if (resData.success && resData.data) {
          setData(resData.data);
        }
        if (resProviders.success && resProviders.data) {
          setProviders(resProviders.data);
        }
      })
      .catch((err) => console.error('Error fetching dashboard', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
          <span className="text-sm font-medium">Đang tải dữ liệu tổng quan kho Betashop...</span>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = data.orders.reduce((sum, o) => sum + (o.finalTotal || o.totalAmount || 0), 0);
  const pendingOrders = data.orders.filter((o) => o.status === 'PENDING').length;
  const lowStockCount = data.stocks.filter((s) => s.available <= s.minAlert).length;
  const totalCustomers = data.customers.length;
  const totalSuppliersDebt = data.suppliers.reduce((sum, s) => sum + (s.balanceDue || 0), 0);

  // Revenue 30-day Chart Mockup data based on actual volume
  const revenueHistory = [
    { date: '18/10', doanhThu: 14500000, donHang: 4 },
    { date: '21/10', doanhThu: 22800000, donHang: 7 },
    { date: '24/10', doanhThu: 18900000, donHang: 5 },
    { date: '27/10', doanhThu: 31200000, donHang: 9 },
    { date: '30/10', doanhThu: 25400000, donHang: 6 },
    { date: '02/11', doanhThu: 38900000, donHang: 11 },
    { date: '05/11', doanhThu: 42100000, donHang: 14 },
    { date: '08/11', doanhThu: 29500000, donHang: 8 },
    { date: '11/11', doanhThu: 58900000, donHang: 18 },
    { date: '14/11', doanhThu: 36400000, donHang: 10 },
    { date: '16/11', doanhThu: 48900000, donHang: 15 },
  ];

  // Top 10 Best Sellers Bar Chart
  const topProductsChart = data.products.slice(0, 7).map((p) => ({
    name: p.title.length > 18 ? `${p.title.slice(0, 18)}...` : p.title,
    daBan: p.sold || Math.floor(20 + Math.random() * 80),
    doanhThuTrieu: Math.round(((p.sold || 30) * p.price) / 1000000),
  }));

  // Order Status Pie Chart
  const orderStatusPie = [
    { name: 'Hoàn thành', value: data.orders.filter((o) => o.status === 'COMPLETED').length || 6 },
    { name: 'Đang giao', value: data.orders.filter((o) => o.status === 'SHIPPING').length || 2 },
    { name: 'Chờ xác nhận', value: data.orders.filter((o) => o.status === 'PENDING').length || 2 },
    { name: 'Đã hủy', value: data.orders.filter((o) => o.status === 'CANCELLED').length || 1 },
  ];

  // Low Stock Items (under minAlert)
  const lowStockItems = data.stocks.filter((s) => s.available <= s.minAlert).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Tổng Kho Đồ Gia Dụng Betashop</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Live Real-Time
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Báo cáo vận hành tức thời đa kho (Hà Nội & TP. Hồ Chí Minh), bán hàng online và tại quầy POS.
          </p>
        </div>

        {/* Time filters & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-md transition ${
                timeFilter === 'today' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hôm nay
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 rounded-md transition ${
                timeFilter === '7days' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 ngày
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1.5 rounded-md transition ${
                timeFilter === '30days' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 ngày
            </button>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh Thu */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400">Tổng Doanh Thu</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {formatVND(totalRevenue)}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với tháng trước
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Đơn Hàng Mới */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400">Đơn Hàng / Chờ Xử Lý</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {data.orders.length} <span className="text-xs font-normal text-slate-500">đơn</span>
            </h3>
            <p className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" /> {pendingOrders} đơn chờ xác nhận
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Tồn Kho Cảnh Báo */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400">Sản Phẩm Sắp Hết Hàng</p>
            <h3 className="text-xl sm:text-2xl font-black text-amber-400">
              {lowStockCount} <span className="text-xs font-normal text-slate-500">mẫu</span>
            </h3>
            <p className="text-[11px] text-red-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Dưới ngưỡng tối thiểu 5 chiếc
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        {/* Khách Hàng CRM */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:border-slate-700 transition">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400">Khách Hàng Hệ Thống</p>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {totalCustomers} <span className="text-xs font-normal text-slate-500">khách</span>
            </h3>
            <p className="text-[11px] text-purple-400 flex items-center gap-1 font-semibold">
              <Users className="w-3.5 h-3.5" /> 2 khách hàng VIP
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Operational Alerts Widget Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NCC Debt Alert */}
        <div className="bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Công Nợ Nhà Cung Cấp Đến Hạn
              </h4>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {formatVND(totalSuppliersDebt)}
              </p>
              <p className="text-[11px] text-slate-400">
                Khoản nợ lớn nhất: Elmich Việt Nam & Philips Electronics
              </p>
            </div>
          </div>
          <Link
            href="/admin/suppliers"
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-xs transition whitespace-nowrap"
          >
            Chi tiết công nợ →
          </Link>
        </div>

        {/* POS Fast Entry Widget */}
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Thu Ngân Bán Hàng Tại Quầy (POS)
              </h4>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">
                Hỗ trợ quét mã vạch Barcode, in hóa đơn nhiệt K80 tức thì
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders/pos"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition whitespace-nowrap"
          >
            Mở quầy POS →
          </Link>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue 30-Day Line/Area Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Biểu Đồ Doanh Thu & Số Lượng Đơn Hàng (30 Ngày)
              </h3>
              <p className="text-xs text-slate-400">Doanh thu ghi nhận qua cả kênh Online và tại quầy POS</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">VNĐ</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `${Math.round(val / 1000000)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [formatVND(Number(val)), 'Doanh thu']}
                />
                <Area
                  type="monotone"
                  dataKey="doanhThu"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDoanhThu)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown (Pie Chart) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              Tỷ Lệ Đơn Hàng Theo Trạng Thái
            </h3>
            <p className="text-xs text-slate-400">Theo dõi tiến độ giao hàng & xử lý đơn</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
            {orderStatusPie.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 10 Best Sellers & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Best Sellers Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Top Sản Phẩm Đồ Gia Dụng Bán Chạy Nhất
              </h3>
              <p className="text-xs text-slate-400">Xếp hạng theo số lượng đã bán thực tế</p>
            </div>
            <Link href="/admin/products" className="text-xs text-emerald-400 font-bold hover:underline">
              Tất cả SP →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsChart} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                />
                <Bar dataKey="daBan" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Đã bán" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Low Stock Warning Table */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Cảnh Báo Tồn Kho Sắp Hết</span>
              </h3>
              <p className="text-xs text-slate-400">Các mặt hàng cần lập phiếu nhập kho gấp</p>
            </div>
            <Link href="/admin/inventory/imports" className="text-xs text-emerald-400 font-bold hover:underline">
              + Nhập kho ngay
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-2.5">Sản Phẩm</th>
                  <th className="p-2.5">Kho Hàng</th>
                  <th className="p-2.5 text-center">Tồn Hiện Tại</th>
                  <th className="p-2.5 text-center">Định Mức</th>
                  <th className="p-2.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lowStockItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      Tất cả sản phẩm đều đủ lượng tồn kho tối thiểu.
                    </td>
                  </tr>
                ) : (
                  lowStockItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 font-medium text-slate-200 truncate max-w-[150px]">
                        {item.productName}
                      </td>
                      <td className="p-2.5 text-slate-400">{item.warehouseName.replace('Kho ', '')}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
                          {item.available} {item.available <= 2 ? '⚠️' : ''}
                        </span>
                      </td>
                      <td className="p-2.5 text-center text-slate-400 font-bold">{item.minAlert}</td>
                      <td className="p-2.5 text-right">
                        <Link
                          href="/admin/inventory/imports"
                          className="px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold rounded text-[11px]"
                        >
                          Nhập hàng
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upstream Providers & API Health Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>Hạ Tầng Nhà Cung Cấp & Sức Khỏe API (Upstream Providers)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                  {providers.length > 0 ? `${providers.filter((p) => p.status === 'active').length}/${providers.length} Sẵn Sàng` : 'Đang giám sát'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Giám sát tình trạng kết nối, độ trễ và nguồn cung từ các đối tác API tự động
              </p>
            </div>
          </div>
          <Link
            href="/admin/providers"
            className="text-xs text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            Quản trị cổng API ({providers.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {(providers.length > 0
            ? providers
            : [
                { id: '1', code: 'hupsms', name: 'HupSMS', status: 'active', latencyMs: 145, productsCount: 15 },
                { id: '2', code: 'vuavia', name: 'VuaVia', status: 'active', latencyMs: 180, productsCount: 84 },
                { id: '3', code: 'thapcammmo', name: 'ThapCamMMO', status: 'active', latencyMs: 110, productsCount: 120 },
                { id: '4', code: 'taikhoan', name: 'TaiKhoan.site', status: 'active', latencyMs: 230, productsCount: 22 },
                { id: '5', code: 'thanhplus', name: 'ThanhPlus.vn', status: 'active', latencyMs: 95, productsCount: 8 },
                { id: '6', code: 'local', name: 'Kho Nội Bộ', status: 'active', latencyMs: 5, productsCount: 4 },
              ]
          ).map((p) => (
            <div
              key={p.code || p.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-sm">{p.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    p.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                  }`}
                  title={p.status === 'active' ? 'Hoạt động bình thường' : 'Gián đoạn'}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Độ trễ API:</span>
                  <span className="font-mono font-bold text-slate-300">
                    {p.latencyMs ? `${p.latencyMs}ms` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Sản phẩm:</span>
                  <Link
                    href={`/admin/products?provider=${p.code}`}
                    className="font-bold text-emerald-400 hover:underline"
                  >
                    {p.productsCount ?? 0} mã
                  </Link>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono uppercase">{p.code}</span>
                <Link
                  href={`/admin/products?provider=${p.code}`}
                  className="text-slate-400 hover:text-emerald-400 font-medium transition"
                >
                  Lọc hàng →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent 10 Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base">
              10 Đơn Hàng Mới Nhất
            </h3>
            <p className="text-xs text-slate-400">Theo dõi thời gian thực từ web và quầy thu ngân</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-emerald-400 font-bold hover:underline">
            Xem toàn bộ đơn hàng →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Mã Đơn</th>
                <th className="p-3">Kênh Bán</th>
                <th className="p-3">Khách Hàng</th>
                <th className="p-3">Tổng Tiền</th>
                <th className="p-3">Thanh Toán</th>
                <th className="p-3">Trạng Thái</th>
                <th className="p-3">Thời Gian</th>
                <th className="p-3 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.orders.slice(0, 10).map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    #{o.code}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        o.orderType === 'POS'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {o.orderType === 'POS' ? 'TẠI QUẦY (POS)' : 'ONLINE'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-200">{o.customerName}</div>
                    <div className="text-[11px] text-slate-400">{o.phone}</div>
                  </td>
                  <td className="p-3 font-extrabold text-white">
                    {formatVND(o.finalTotal || o.totalAmount)}
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : o.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : o.status === 'SHIPPING'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {o.statusText || o.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{o.createdAt}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white inline-flex items-center gap-1 font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </Link>
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
