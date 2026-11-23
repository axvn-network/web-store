'use client';

import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Search, ShieldCheck, Warehouse, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { AdminUser, Warehouse as WarehouseType } from '@/lib/adminDb';

export default function StaffAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roleCode, setRoleCode] = useState<'SUPER_ADMIN' | 'WAREHOUSE_MANAGER' | 'CASHIER' | 'ACCOUNTANT' | 'CSKH'>('CASHIER');
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = () => {
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setUsers(res.data.users || []);
          setWarehouses(res.data.warehouses || []);
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const roleNames = {
      SUPER_ADMIN: 'Super Admin',
      WAREHOUSE_MANAGER: 'Quản lý Kho',
      CASHIER: 'Thu ngân POS',
      ACCOUNTANT: 'Kế toán',
      CSKH: 'Chăm sóc KH',
    };

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      roleCode,
      roleName: roleNames[roleCode],
      isActive: true,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    setUsers([newUser, ...users]);
    setShowAdd(false);
    setName('');
    setEmail('');
    setPhone('');
    setToast('Thêm nhân viên mới thành công!');
    setTimeout(() => setToast(null), 3000);
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
            <UserCog className="w-5 h-5 text-emerald-400" />
            <span>Quản Lý Nhân Viên & Phân Bổ Chi Nhánh</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {users.length} tài khoản
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý danh sách nhân sự thủ kho, thu ngân POS, nhân viên CSKH và kế toán vận hành.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhân Viên</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="p-3">Họ Tên Nhân Viên</th>
              <th className="p-3">Email Đăng Nhập</th>
              <th className="p-3">Số Điện Thoại</th>
              <th className="p-3">Vai Trò (Role)</th>
              <th className="p-3">Chi Nhánh Phụ Trách</th>
              <th className="p-3 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition">
                <td className="p-3 font-bold text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-3 text-slate-300 font-mono">{u.email}</td>
                <td className="p-3 text-slate-400">{u.phone}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      u.roleCode === 'SUPER_ADMIN'
                        ? 'bg-purple-500/20 text-purple-400'
                        : u.roleCode === 'WAREHOUSE_MANAGER'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {u.roleName}
                  </span>
                </td>
                <td className="p-3 text-slate-300 font-medium">
                  Kho Tổng Hà Nội - Mỹ Đình
                </td>
                <td className="p-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    Đang hoạt động
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Staff */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCog className="w-4 h-4 text-emerald-400" />
              <span>Thêm Nhân Viên Mới</span>
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lê Thị Cẩm Ly..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email đăng nhập <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ly.le@betashop.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    placeholder="0988 555 666"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vai trò (Role)
                  </label>
                  <select
                    value={roleCode}
                    onChange={(e) => setRoleCode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CASHIER">Thu ngân POS</option>
                    <option value="WAREHOUSE_MANAGER">Quản lý kho</option>
                    <option value="ACCOUNTANT">Kế toán</option>
                    <option value="CSKH">Chăm sóc KH</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
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
                  Lưu Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
