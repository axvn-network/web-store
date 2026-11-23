'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CustomerVpsInstance } from '@/lib/xvpsApi';
import { 
  FiServer, 
  FiPlay, 
  FiSquare, 
  FiRotateCw, 
  FiCalendar, 
  FiCopy, 
  FiCheck, 
  FiCpu, 
  FiHardDrive, 
  FiShield, 
  FiEye, 
  FiEyeOff, 
  FiZap
} from 'react-icons/fi';
import { BiHomeAlt, BiChevronRight } from 'react-icons/bi';

export default function CustomerCloudVpsPage() {
  const [vpsList, setVpsList] = useState<CustomerVpsInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showPassMap, setShowPassMap] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  const fetchVpsList = async () => {
    try {
      const res = await fetch('/api/cloud/vps');
      const data = await res.json();
      if (data.success) {
        setVpsList(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVpsList();
  }, []);

  const handleAction = async (vpsId: string, action: 'start' | 'stop' | 'restart' | 'renew') => {
    setActionLoading(`${vpsId}-${action}`);
    setMessage(null);
    try {
      const res = await fetch(`/api/cloud/vps/${vpsId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✓ ${data.message}`);
        await fetchVpsList();
      } else {
        alert(data.error || 'Thao tác không thành công.');
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedMap((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const togglePassword = (id: string) => {
    setShowPassMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-1 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-orange-600 flex items-center gap-1">
          <BiHomeAlt className="text-sm" /> Trang chủ
        </Link>
        <BiChevronRight className="text-gray-400" />
        <Link href="/tai-khoan" className="hover:text-orange-600">
          Tài khoản
        </Link>
        <BiChevronRight className="text-gray-400" />
        <span className="text-[#f53d2d] font-bold">Quản lý Cloud VPS & Hosting</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-orange-200 block mb-1">
            Hạ tầng XVPS Partner
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
            Máy Chủ Cloud VPS & Hosting Của Bạn
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Quản lý trạng thái nguồn, địa chỉ IP, mật khẩu root và gia hạn máy chủ tự động 24/7.
          </p>
        </div>

        <Link
          href="/cloud-vps"
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 sm:px-5 py-2.5 bg-white text-[#f53d2d] hover:bg-orange-50 text-xs font-bold rounded-xl shadow transition active:scale-95 shrink-0"
        >
          <FiServer />
          Đăng Ký Thêm Máy Chủ
        </Link>
      </div>

      {/* Alert Notification */}
      {message && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm">
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* VPS List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-gray-500 border border-gray-100 shadow-sm">
          Đang tải danh sách máy chủ...
        </div>
      ) : vpsList.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#f53d2d] flex items-center justify-center text-3xl mx-auto mb-3">
            <FiServer />
          </div>
          <h3 className="text-base font-bold text-gray-900">Bạn chưa có máy chủ nào</h3>
          <p className="text-xs text-gray-500 mt-1 mb-5">
            Khởi tạo máy chủ Cloud Hosting NVMe, VPS VMware hoặc VPS KVM chỉ từ 45.000 ₫/tháng.
          </p>
          <Link
            href="/cloud-vps"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f53d2d] hover:bg-[#e03122] text-white text-xs font-bold rounded-xl shadow transition active:scale-95"
          >
            Xem Bảng Giá & Đăng Ký
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {vpsList.map((vps) => {
            const isPassVisible = showPassMap[vps.id] || false;
            return (
              <div
                key={vps.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  {/* Left Info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-50 text-[#f53d2d]">
                        {vps.type === 'cloud-hosting'
                          ? 'Cloud Hosting'
                          : vps.type === 'vps-vmware'
                          ? 'VPS VMware'
                          : 'Cloud VPS KVM'}
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-400">
                        #{vps.code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          vps.status === 'RUNNING'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : vps.status === 'STOPPED'
                            ? 'bg-gray-100 text-gray-700 border border-gray-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            vps.status === 'RUNNING'
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-gray-400'
                          }`}
                        />
                        {vps.status === 'RUNNING'
                          ? 'Đang hoạt động'
                          : vps.status === 'STOPPED'
                          ? 'Đã tắt máy'
                          : 'Đang thao tác'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                      {vps.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Gói: <span className="font-semibold text-gray-700">{vps.planName}</span> • Hệ điều hành: <span className="font-semibold text-gray-700">{vps.os}</span>
                    </p>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {vps.status === 'STOPPED' ? (
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(vps.id, 'start')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <FiPlay />
                        Bật Máy Chủ
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(vps.id, 'stop')}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <FiSquare />
                        Tắt Máy
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={!!actionLoading || vps.status === 'STOPPED'}
                      onClick={() => handleAction(vps.id, 'restart')}
                      className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <FiRotateCw />
                      Khởi Động Lại
                    </button>

                    <button
                      type="button"
                      disabled={!!actionLoading}
                      onClick={() => handleAction(vps.id, 'renew')}
                      className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-[#f53d2d] text-xs font-bold rounded-xl transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                      <FiCalendar />
                      Gia Hạn 1 Tháng
                    </button>
                  </div>
                </div>

                {/* Specs & Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
                  {/* IP Address */}
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block mb-0.5">Địa chỉ IP WAN:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gray-900 text-sm">
                        {vps.ipAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(vps.ipAddress, `ip-${vps.id}`)}
                        className="text-gray-400 hover:text-gray-700 p-1"
                        title="Sao chép IP"
                      >
                        {copiedMap[`ip-${vps.id}`] ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block truncate">
                      {vps.hostname}
                    </span>
                  </div>

                  {/* Hardware */}
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block mb-0.5">Cấu hình máy chủ:</span>
                    <div className="font-bold text-gray-900">
                      {vps.cpu}
                    </div>
                    <span className="text-[11px] text-gray-600 block mt-0.5">
                      {vps.ram} • {vps.storage}
                    </span>
                  </div>

                  {/* Credentials */}
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block mb-0.5">Tài khoản & Mật khẩu:</span>
                    <div className="font-mono font-bold text-gray-900">
                      {vps.adminUser || 'root'}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-mono text-gray-600 font-semibold text-xs">
                        {isPassVisible ? vps.adminPassword : '••••••••••••'}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <button
                          type="button"
                          onClick={() => togglePassword(vps.id)}
                          className="hover:text-gray-700 p-1"
                          title="Hiện / Ẩn mật khẩu"
                        >
                          {isPassVisible ? <FiEyeOff /> : <FiEye />}
                        </button>
                        {vps.adminPassword && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(vps.adminPassword || '', `pwd-${vps.id}`)}
                            className="hover:text-gray-700 p-1"
                            title="Sao chép mật khẩu"
                          >
                            {copiedMap[`pwd-${vps.id}`] ? <FiCheck className="text-emerald-600" /> : <FiCopy />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 text-[11px] block mb-0.5">Hạn sử dụng:</span>
                    <div className="font-bold text-gray-900">
                      {vps.expiredAt}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                      ✓ Đã bật tự động gia hạn
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
