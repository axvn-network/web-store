'use client';

import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Plus,
  Search,
  MapPin,
  Phone,
  User,
  Boxes,
  CheckCircle2,
} from 'lucide-react';
import { Warehouse as WarehouseType } from '@/lib/adminDb';

export default function WarehousesAdminPage() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [manager, setManager] = useState('');
  const [capacity, setCapacity] = useState(3000);
  const [toast, setToast] = useState<string | null>(null);

  const fetchWarehouses = () => {
    fetch('/api/admin/data?slice=warehouses')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setWarehouses(res.data);
        }
      });
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;

    const res = await fetch('/api/admin/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_warehouse',
        payload: {
          name,
          code: code || `KHO-${Date.now().toString(36).toUpperCase()}`,
          address,
          phone,
          managerName: manager,
          totalCapacity: capacity,
          isDefault: false,
        },
      }),
    });
    const result = await res.json();
    if (result.success) {
      setToast('Thêm kho hàng mới thành công!');
      setShowAdd(false);
      setName('');
      setCode('');
      setAddress('');
      setPhone('');
      setManager('');
      fetchWarehouses();
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-5">
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
            <Warehouse className="w-5 h-5 text-emerald-400" />
            <span>Hệ Thống Kho & Chi Nhánh Toàn Quốc</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {warehouses.length} kho
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý đa kho hàng, sức chứa lưu trữ, thủ kho phụ trách và định tuyến giao hàng theo khu vực.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Chi Nhánh / Kho</span>
        </button>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">{wh.name}</h3>
                  {wh.isDefault && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full border border-emerald-500/30">
                      Kho Tổng
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-emerald-400 font-bold">{wh.code}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                <Warehouse className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>{wh.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>{wh.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Thủ kho phụ trách: <strong>{wh.managerName || 'Nguyễn Văn Hùng'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Sức chứa ước tính: <strong>{wh.totalCapacity?.toLocaleString('vi-VN') || '5.000'} sản phẩm</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Warehouse */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Thêm Kho / Chi Nhánh Mới</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tên kho <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kho Đà Nẵng..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mã kho
                </label>
                <input
                  type="text"
                  placeholder="KHO-DN"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Địa chỉ kho <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Số nhà, đường, quận/huyện, tỉnh..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    placeholder="0236 3888 999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Thủ kho phụ trách
                  </label>
                  <input
                    type="text"
                    placeholder="Họ và tên..."
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Lưu Kho Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
