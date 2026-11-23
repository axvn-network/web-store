'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Building, DollarSign, Printer, Shield, Palette, Sparkles, Check } from 'lucide-react';
import { SystemSetting } from '@/lib/adminDb';

const COLOR_PRESETS = [
  { name: 'Cam Năng Động (Mặc định)', color: '#f53d2d', preset: 'orange', desc: 'Rực rỡ, kích thích mua sắm đồ gia dụng' },
  { name: 'Xanh Dương Công Nghệ', color: '#2563eb', preset: 'blue', desc: 'Uy tín, chuyên nghiệp thiết bị điện tử' },
  { name: 'Xanh Lục Sinh Thái', color: '#059669', preset: 'emerald', desc: 'Mát mẻ, lọc nước & thiết bị xanh' },
  { name: 'Đỏ Ruby Sang Trọng', color: '#dc2626', preset: 'red', desc: 'Mạnh mẽ, phong cách gia dụng cao cấp' },
  { name: 'Tím Hoàng Gia', color: '#7c3aed', preset: 'purple', desc: 'Đẳng cấp, sáng tạo và nổi bật' },
  { name: 'Xanh Cyan Đại Dương', color: '#0891b2', preset: 'cyan', desc: 'Tươi mới, quạt điều hòa làm mát' },
  { name: 'Đen Titan Tối Giản', color: '#0f172a', preset: 'slate', desc: 'Tối giản, phong cách Hi-End hiện đại' },
];

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SystemSetting | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/data?slice=settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setSettings((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_settings', payload: settings }),
    });

    const result = await res.json();
    if (result.success) {
      setToast('Lưu cấu hình hệ thống thành công!');
      setTimeout(() => setToast(null), 3000);
    }
    setSaving(false);
  };

  if (!settings) {
    return <div className="p-8 text-center text-slate-400">Đang tải cấu hình hệ thống...</div>;
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Cài Đặt Hệ Thống & Cửa Hàng Betashop</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình thông tin doanh nghiệp, tài khoản ngân hàng chuyển khoản VietQR, thuế VAT và chính sách kho.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Thông tin doanh nghiệp */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-emerald-400" />
            <span>Thông Tin Doanh Nghiệp & Tổng Kho</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên cửa hàng / Doanh nghiệp
              </label>
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hotline CSKH
                </label>
                <input
                  type="text"
                  name="hotline"
                  value={settings.hotline}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={settings.taxCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Địa chỉ trụ sở chính
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email liên hệ</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Tài khoản VietQR & Thuế */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Thanh Toán VietQR & Thuế VAT</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ngân hàng thụ hưởng
              </label>
              <input
                type="text"
                name="bankName"
                value={settings.bankName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={settings.bankAccount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-bold text-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chủ tài khoản
                </label>
                <input
                  type="text"
                  name="bankAccountName"
                  value={settings.bankAccountName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Thuế VAT mặc định (%)
                </label>
                <input
                  type="number"
                  name="vatDefault"
                  value={settings.vatDefault}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tiền tệ</label>
                <input
                  type="text"
                  disabled
                  value="VND (₫)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-400 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 space-y-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoPrintReceipt"
                  name="autoPrintReceipt"
                  checked={settings.autoPrintReceipt}
                  onChange={handleChange}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 cursor-pointer"
                />
                <label
                  htmlFor="autoPrintReceipt"
                  className="text-xs text-slate-300 select-none cursor-pointer"
                >
                  Tự động mở cửa sổ in hóa đơn K80 ngay sau khi thanh toán POS
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowNegativeStock"
                  name="allowNegativeStock"
                  checked={settings.allowNegativeStock}
                  onChange={handleChange}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-950 cursor-pointer"
                />
                <label
                  htmlFor="allowNegativeStock"
                  className="text-xs text-slate-300 select-none cursor-pointer"
                >
                  Cho phép xuất kho khi số lượng tồn = 0 (xuất âm kho)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Màu Sắc Chủ Đạo & Giao Diện Cửa Hàng (Toàn bộ chiều rộng) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Màu Sắc Chủ Đạo & Nhận Diện Thương Hiệu (Brand & Theme Color)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tùy chỉnh màu sắc chủ đạo của toàn bộ hệ thống bán lẻ (Nút mua hàng, nhãn khuyến mãi, viền highlight, widget liên hệ, icon...).
              </p>
            </div>

            {/* Live Preview Pill */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-slate-400">Màu hiện tại:</span>
              <div
                className="w-5 h-5 rounded-md shadow-sm border border-white/20 transition-all"
                style={{ backgroundColor: settings.primaryColor || '#f53d2d' }}
              />
              <span className="text-xs font-mono font-bold text-white">
                {settings.primaryColor || '#f53d2d'}
              </span>
            </div>
          </div>

          {/* Color Presets Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2.5">
              Chọn nhanh theo bảng màu phong cách đồ gia dụng:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = (settings.primaryColor || '#f53d2d').toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.preset}
                    type="button"
                    onClick={() => {
                      setSettings((prev: any) => ({
                        ...prev,
                        primaryColor: preset.color,
                        themePreset: preset.preset,
                      }));
                      if (typeof window !== 'undefined') {
                        document.documentElement.style.setProperty('--color-primary', preset.color);
                        localStorage.setItem('betashop_primary_color', preset.color);
                      }
                    }}
                    className={`relative p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-white bg-slate-800/90 shadow-lg scale-[1.02]'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 shadow-md flex items-center justify-center border border-white/20"
                      style={{ backgroundColor: preset.color }}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{preset.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom HEX Color Picker & Live Button Preview */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hoặc chọn mã màu tùy biến (Hex Code):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.primaryColor || '#f53d2d'}
                  onChange={(e) => {
                    const col = e.target.value;
                    setSettings((prev: any) => ({ ...prev, primaryColor: col, themePreset: 'custom' }));
                    if (typeof window !== 'undefined') {
                      document.documentElement.style.setProperty('--color-primary', col);
                      localStorage.setItem('betashop_primary_color', col);
                    }
                  }}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-700 p-0.5"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={settings.primaryColor || '#f53d2d'}
                  onChange={(e) => {
                    const col = e.target.value;
                    setSettings((prev: any) => ({ ...prev, primaryColor: col, themePreset: 'custom' }));
                    if (typeof window !== 'undefined') {
                      document.documentElement.style.setProperty('--color-primary', col);
                      localStorage.setItem('betashop_primary_color', col);
                    }
                  }}
                  placeholder="#f53d2d"
                  className="w-36 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white uppercase"
                />
                <span className="text-[11px] text-slate-400">
                  (Màu sẽ áp dụng tự động cho Storefront & Khách hàng)
                </span>
              </div>
            </div>

            {/* Live Component Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-semibold text-slate-400">Xem thử:</span>
              <button
                type="button"
                className="px-3.5 py-1.5 text-xs font-bold text-white rounded-lg shadow transition hover:opacity-90 flex items-center gap-1.5"
                style={{ backgroundColor: settings.primaryColor || '#f53d2d' }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nút Mua Hàng</span>
              </button>
              <span
                className="px-2.5 py-1 text-[11px] font-bold rounded-md border"
                style={{
                  color: settings.primaryColor || '#f53d2d',
                  borderColor: settings.primaryColor || '#f53d2d',
                  backgroundColor: `${settings.primaryColor || '#f53d2d'}15`,
                }}
              >
                Giảm 30% Hot Sale
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
