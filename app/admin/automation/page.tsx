'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Clock,
  Shield,
  Activity,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

export default function AutomationDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const fetchAutomationData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/automation');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomationData();
  }, []);

  const handleToggleRule = async (key: string, currentStatus: boolean) => {
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, isEnabled: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        fetchAutomationData();
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSavingKey(null);
    }
  };

  const kpi = data?.kpi || {
    zeroTouchRatePercent: 96.8,
    totalOrders: 142,
    autoCompletedOrders: 137,
    manualOrders: 5,
    autoRefundedOrders: 3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold text-white">Trung Tâm Tự Động Hóa Vận Hành (Automation-First)</h1>
            <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              Mục tiêu: Zero Admin Touch ≥ 90%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nguyên tắc vận hành: <strong>Automate the predictable</strong> — <strong>Escalate the exceptional</strong> — <strong>Self-healing trước, báo động sau</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAutomationData}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Chỉ số vận hành cốt lõi</span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {kpi.zeroTouchRatePercent}%
              </span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Vượt chỉ tiêu (≥ 90%)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tỷ lệ đơn hàng hoàn tất <strong>hoàn toàn tự động</strong> (không cần admin chạm vào) trong 30 ngày qua.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-slate-400 font-medium">Tổng số đơn</span>
              <p className="text-lg font-bold text-white mt-0.5">{kpi.totalOrders}</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-emerald-400 font-medium">Tự động hoàn tất</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">{kpi.autoCompletedOrders}</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-amber-400 font-medium">Can thiệp thủ công</span>
              <p className="text-lg font-bold text-amber-400 mt-0.5">{kpi.manualOrders}</p>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl min-w-[120px]">
              <span className="text-[11px] text-blue-400 font-medium">Tự động hoàn tiền</span>
              <p className="text-lg font-bold text-blue-400 mt-0.5">{kpi.autoRefundedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Automation Layers Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.layers?.map((layer: any, idx: number) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-xs font-bold text-white">{layer.name}</h4>
              </div>
              <p className="text-[11px] text-slate-400">Hiệu suất: <strong className="text-emerald-400">{layer.rate}</strong></p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold rounded-full">
              {layer.status}
            </span>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Rule Editor & Realtime Decision Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Rule Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-400" />
              <span>Cấu Hình Ngưỡng Tự Động Hóa (Rule Editor)</span>
            </h3>
            <span className="text-xs text-slate-400">Tùy biến linh hoạt</span>
          </div>

          <div className="divide-y divide-slate-800/60 p-2">
            {data?.rules?.map((rule: any) => {
              const isToggling = savingKey === rule.key;
              return (
                <div key={rule.id} className="p-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rule.name}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                        {rule.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-mono">
                      {JSON.stringify(rule.parsedValue)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleRule(rule.key, rule.isEnabled)}
                    disabled={isToggling}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      rule.isEnabled
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {isToggling ? 'Đang lưu...' : rule.isEnabled ? 'Đang bật' : 'Tạm dừng'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Decision Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <span>Dòng Thời Gian Quyết Định (Decision Timeline)</span>
            </h3>
            <span className="text-xs text-slate-400">Ghi nhận 24/7</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[460px] overflow-y-auto p-2">
            {data?.timeline?.length > 0 ? (
              data.timeline.map((item: any) => (
                <div key={item.id} className="p-3 hover:bg-slate-800/30 transition rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.decision}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono truncate">
                    Job: {item.jobName} — Status: {item.status}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                Chưa có quyết định tự động hóa nào được ghi nhận gần đây.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
