'use client';

import React, { useState, useEffect } from 'react';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Plus,
  Shield,
  Activity,
  Zap,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ProviderItem {
  id: string;
  code: string;
  name: string;
  apiBaseUrl: string;
  maskedApiKey: string;
  balance: number;
  currency: string;
  status: 'active' | 'degraded' | 'down';
  priority: number;
  healthCheckUrl?: string;
  lastHealthCheckAt?: string;
  notes?: string;
  servicesCount: number;
  productsCount?: number;
  healthLogsCount: number;
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string; success: boolean } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formBaseUrl, setFormBaseUrl] = useState('');
  const [formApiKey, setFormApiKey] = useState('');
  const [formPriority, setFormPriority] = useState('1');
  const [formHealthUrl, setFormHealthUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/providers');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProviders(data.data);
      }
    } catch (e) {
      console.error('Lỗi tải danh sách providers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleTestConnection = async (id: string, code: string) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await fetch(`/api/admin/providers/${id}/test`, { method: 'POST' });
      const data = await res.json();
      setTestResult({
        id,
        message: data.message || (data.success ? 'Kết nối thành công!' : 'Thất bại'),
        success: data.success,
      });
      fetchProviders();
    } catch {
      setTestResult({
        id,
        message: 'Lỗi mạng khi kiểm tra kết nối API',
        success: false,
      });
    } finally {
      setTestingId(null);
    }
  };

  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName || !formBaseUrl || !formApiKey) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formCode.trim().toLowerCase(),
          name: formName.trim(),
          apiBaseUrl: formBaseUrl.trim(),
          apiKey: formApiKey.trim(),
          priority: Number(formPriority) || 1,
          healthCheckUrl: formHealthUrl.trim() || undefined,
          notes: formNotes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormCode('');
        setFormName('');
        setFormBaseUrl('');
        setFormApiKey('');
        setFormNotes('');
        fetchProviders();
      } else {
        alert(data.error || 'Có lỗi xảy ra khi lưu nhà cung cấp');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = providers.filter((p) => p.status === 'active').length;
  const degradedCount = providers.filter((p) => p.status === 'degraded' || p.status === 'down').length;
  const totalServices = providers.reduce((acc, p) => acc + (p.servicesCount || 0), 0);
  const totalProducts = providers.reduce((acc, p) => acc + (p.productsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Quản Lý Nhà Cung Cấp & Tích Hợp API (Aggregator)</h1>
            <span className="text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold px-2.5 py-0.5 rounded-full">
              AES-256-GCM
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị tập trung 6 đầu mối cung cấp upstream (HupSMS, TaiKhoan, VuaVia, ThanhPlus, ThapCamMMO, Kho Nội Bộ), giám sát độ trễ, tự động định tuyến và chuyển đổi dự phòng (failover).
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchProviders}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Provider</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng Providers</span>
            <Network className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{providers.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Đã kết nối vào hệ thống</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hoạt Động Tốt</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{activeCount}</p>
          <p className="text-[11px] text-emerald-500/80 mt-0.5">Sẵn sàng nhận lệnh fulfill</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sản Phẩm Kết Nối</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{totalProducts}</p>
          <p className="text-[11px] text-cyan-500/80 mt-0.5">Đang bán trên Storefront</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Cảnh Báo / Down</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{degradedCount}</p>
          <p className="text-[11px] text-amber-500/80 mt-0.5">Đang kích hoạt failover</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Dịch Vụ Gốc</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalServices}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Upstream services</p>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span>Danh Sách Cổng Kết Nối Nhà Cung Cấp</span>
          </h2>
          <span className="text-xs text-slate-400">Mã hóa chuẩn AES-256-GCM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Nhà cung cấp</th>
                <th className="py-3 px-4">Base URL & API Key</th>
                <th className="py-3 px-4 text-center">Ưu tiên</th>
                <th className="py-3 px-4 text-center">Sản phẩm liên kết</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Số dư ví (Upstream)</th>
                <th className="py-3 px-4">Ping gần nhất</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {providers.map((p) => {
                const isTesting = testingId === p.id;
                const result = testResult && testResult.id === p.id ? testResult : null;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">
                          {p.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.notes || 'Không có ghi chú'}</p>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-slate-300 truncate max-w-[200px]">{p.apiBaseUrl}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        <span>Key: {p.maskedApiKey}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 bg-slate-800 text-orange-400 font-bold rounded-md">
                        #{p.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Link
                        href={`/admin/products?provider=${p.code}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 hover:bg-blue-900/60 text-blue-400 font-bold transition text-[11px]"
                      >
                        <span>{p.productsCount || 0} sản phẩm</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      {p.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Hoạt động</span>
                        </span>
                      ) : p.status === 'degraded' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/60 border border-amber-800/60 text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Giảm tải</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-950/60 border border-red-800/60 text-red-400">
                          <XCircle className="w-3 h-3" />
                          <span>Gián đoạn</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">
                        {p.balance ? `${p.balance.toLocaleString('vi-VN')} ${p.currency || '₫'}` : '0 ₫'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{p.lastHealthCheckAt ? new Date(p.lastHealthCheckAt).toLocaleTimeString('vi-VN') : 'Chưa kiểm tra'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTestConnection(p.id, p.code)}
                          disabled={isTesting}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Zap className={`w-3.5 h-3.5 text-amber-400 ${isTesting ? 'animate-bounce' : ''}`} />
                          <span>{isTesting ? 'Đang gọi...' : 'Kiểm tra API'}</span>
                        </button>
                      </div>

                      {result && (
                        <div
                          className={`mt-1 text-[11px] font-semibold ${
                            result.success ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {result.message}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Network className="w-5 h-5 text-orange-500" />
                <span>Thêm Nhà Cung Cấp Mới (Upstream Provider)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProvider} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mã định danh (Code)*</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: hupsms, vuavia"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tên hiển thị*</label>
                  <input
                    type="text"
                    required
                    placeholder="vd: HupSMS Gateway"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">API Base URL*</label>
                <input
                  type="url"
                  required
                  placeholder="https://hupsms.com/api/v1"
                  value={formBaseUrl}
                  onChange={(e) => setFormBaseUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  API Key* (Sẽ được mã hóa AES-256-GCM trước khi lưu)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập khóa API bí mật của nhà cung cấp..."
                  value={formApiKey}
                  onChange={(e) => setFormApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Độ ưu tiên (1 = cao nhất)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Health Check URL</label>
                  <input
                    type="text"
                    placeholder="URL ping kiểm tra"
                    value={formHealthUrl}
                    onChange={(e) => setFormHealthUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú vận hành</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về gói dịch vụ, chính sách bảo hành, liên hệ kỹ thuật..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Đang mã hóa & lưu...' : 'Lưu Nhà Cung Cấp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
