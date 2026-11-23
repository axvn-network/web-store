'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CloudProductPlan, 
  CustomerVpsInstance, 
  XvpsAgencyInfo, 
  XVPS_PRODUCT_PLANS 
} from '@/lib/xvpsApi';
import { formatVND } from '@/lib/utils';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Play, 
  Square, 
  RotateCw, 
  Calendar, 
  Award, 
  Layers, 
  Settings, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export default function AdminCloudServicesPage() {
  const [agency, setAgency] = useState<XvpsAgencyInfo | null>(null);
  const [vpsList, setVpsList] = useState<CustomerVpsInstance[]>([]);
  const [plans, setPlans] = useState<CloudProductPlan[]>(XVPS_PRODUCT_PLANS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vps' | 'plans' | 'api-settings'>('vps');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAgency, resVps] = await Promise.all([
        fetch('/api/cloud/agency').then((r) => r.json()),
        fetch('/api/cloud/vps').then((r) => r.json()),
      ]);

      if (resAgency.success) setAgency(resAgency.data);
      if (resVps.success) setVpsList(resVps.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSyncApi = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      await fetchData();
      setMessage('✓ Đã đồng bộ dữ liệu trạng thái máy chủ từ XVPS Gateway thành công!');
    } catch (err) {
      alert('Lỗi đồng bộ API.');
    } finally {
      setSyncing(false);
    }
  };

  const handleAction = async (vpsId: string, action: 'start' | 'stop' | 'restart' | 'renew') => {
    try {
      const res = await fetch(`/api/cloud/vps/${vpsId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✓ ${data.message}`);
        await fetchData();
      } else {
        alert(data.error || 'Lỗi thao tác.');
      }
    } catch (err) {
      alert('Lỗi kết nối.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-orange-600 transition">Tổng quan</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">Quản lý Dịch vụ Cloud & VPS</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-7 h-7 text-[#f53d2d]" />
            Dịch Vụ Cloud Hosting & VPS (XVPS Agency)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Cung cấp và điều khiển hạ tầng máy chủ ảo hóa VMware, KVM và Cloud Hosting NVMe tự động.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={syncing}
            onClick={handleSyncApi}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-orange-500' : ''}`} />
            <span>{syncing ? 'Đang đồng bộ...' : 'Đồng Bộ API'}</span>
          </button>
          <Link
            href="/cloud-vps"
            target="_blank"
            className="px-4 py-2 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs font-bold rounded-xl shadow-md shadow-[#f53d2d]/20 transition flex items-center gap-1.5"
          >
            <span>Xem Trang Bán Hàng</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Agency Status Card */}
      {agency && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white border border-slate-700 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Account Info */}
            <div className="md:col-span-2 flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl shrink-0 border border-orange-500/30">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-black">{agency.agencyName}</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase">
                    {agency.vipLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Hoạt động
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  {agency.email} • Username: <span className="text-orange-300">{agency.username}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Chiết khấu đại lý cấp cao: <span className="font-bold text-emerald-400">-{agency.discountPercent}%</span> cho mọi đơn hàng VPS & Hosting
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Số dư ví đại lý XVPS:
              </span>
              <div className="text-2xl font-black text-emerald-400 tracking-tight mt-1">
                {formatVND(agency.balance)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">
                Tự động trừ tiền khi khách mua mới/gia hạn
              </span>
            </div>

            {/* Total VPS */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-sky-400" /> Máy chủ đang chạy:
              </span>
              <div className="text-2xl font-black text-white tracking-tight mt-1">
                {agency.activeVpsCount} <span className="text-xs font-normal text-slate-400">máy chủ</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1">
                Uptime cam kết: 99.99%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message Banner */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('vps')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'vps'
              ? 'border-[#f53d2d] text-[#f53d2d]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Server className="w-4 h-4" />
          Danh Sách Máy Chủ Của Khách ({vpsList.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'plans'
              ? 'border-[#f53d2d] text-[#f53d2d]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Gói Dịch Vụ Phân Phối ({plans.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('api-settings')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'api-settings'
              ? 'border-[#f53d2d] text-[#f53d2d]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          Cấu Hình Kết Nối API XVPS
        </button>
      </div>

      {/* TAB 1: DANH SÁCH MÁY CHỦ KHÁCH HÀNG */}
      {activeTab === 'vps' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Mã & Tên Máy Chủ</th>
                  <th className="py-3.5 px-4">Phân Loại Gói</th>
                  <th className="py-3.5 px-4">Địa Chỉ IPv4 & Hostname</th>
                  <th className="py-3.5 px-4">Cấu Hình (CPU / RAM / SSD)</th>
                  <th className="py-3.5 px-4">Trạng Thái</th>
                  <th className="py-3.5 px-4">Ngày Hết Hạn</th>
                  <th className="py-3.5 px-4 text-right">Điều Khiển Nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vpsList.map((vps) => (
                  <tr key={vps.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{vps.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">#{vps.code}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-700 block">{vps.planName}</span>
                      <span className="text-[10px] text-orange-600 font-bold uppercase">
                        {vps.type === 'cloud-hosting' ? 'Cloud Hosting' : vps.type === 'vps-vmware' ? 'VMware ESXi' : 'KVM NVMe'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-gray-900 block">{vps.ipAddress}</span>
                      <span className="text-[11px] text-gray-500 font-mono">{vps.hostname}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <div>{vps.cpu}</div>
                      <div className="text-[11px] text-gray-400">{vps.ram} • {vps.storage}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          vps.status === 'RUNNING'
                            ? 'bg-emerald-100 text-emerald-700'
                            : vps.status === 'STOPPED'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vps.status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                          }`}
                        ></span>
                        {vps.status === 'RUNNING' ? 'Hoạt động' : vps.status === 'STOPPED' ? 'Tắt' : 'Rebuild'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-gray-800">{vps.expiredAt}</span>
                      <span className="text-[10px] text-emerald-600 block">Tự động gia hạn</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {vps.status === 'STOPPED' ? (
                          <button
                            type="button"
                            onClick={() => handleAction(vps.id, 'start')}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            title="Bật máy chủ"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAction(vps.id, 'stop')}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                            title="Tắt máy chủ"
                          >
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAction(vps.id, 'restart')}
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                          title="Khởi động lại"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(vps.id, 'renew')}
                          className="p-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition"
                          title="Gia hạn 1 tháng"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GÓI CƯỚC SẢN PHẨM */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-100 text-[#f53d2d]">
                    {plan.categoryName}
                  </span>
                  <span className="font-mono text-xs text-gray-400">{plan.code}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                <div className="text-xl font-black text-gray-900 mt-2 mb-4">
                  {formatVND(plan.priceMonthly)} <span className="text-xs font-normal text-gray-400">/tháng</span>
                </div>

                <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">vCPU:</span>
                    <span className="font-bold text-gray-800">{plan.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">RAM:</span>
                    <span className="font-bold text-gray-800">{plan.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dung lượng:</span>
                    <span className="font-bold text-gray-800">{plan.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Băng thông:</span>
                    <span className="font-bold text-gray-800">{plan.bandwidth}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  {plan.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-emerald-600 font-bold">Lợi nhuận đại lý: +15%</span>
                <span className="text-gray-400">Đang mở bán</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CẤU HÌNH API SETTINGS */}
      {activeTab === 'api-settings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Thông Số Kết Nối XVPS Agency API</h2>
              <p className="text-xs text-gray-500">Tài liệu API chính thức: https://developer.xvps.vn/docs?page=overview</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Base API URL:</label>
              <input
                type="text"
                readOnly
                value="https://api.xvps.vn"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-gray-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Header api-username:</label>
                <input
                  type="text"
                  readOnly
                  value="test_user_45360879"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-gray-700"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Header api-app:</label>
                <input
                  type="text"
                  readOnly
                  value="sandbox_app_fbccdc"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Header api-secret:</label>
              <input
                type="text"
                readOnly
                value="xvps_sandbox_secret"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Header auth-token (JWT Token):</label>
              <input
                type="text"
                readOnly
                value="sb_70463ec098d3418cb38ec3f9c495896b"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 font-mono text-gray-700"
              />
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 leading-relaxed text-xs">
              <span className="font-bold">Đại lý thụ hưởng:</span> Nam Vũ (VIP 1) — Email: <code className="font-bold">namlangtu20162@gmail.com</code>.
              Khi chuyển sang tài khoản live sản xuất, chỉ cần cập nhật các biến môi trường <code>XVPS_API_USERNAME</code>, <code>XVPS_API_APP</code>, <code>XVPS_API_SECRET</code> và <code>XVPS_AUTH_TOKEN</code> trên Netlify.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
