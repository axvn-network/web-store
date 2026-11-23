'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { RoleDef } from '@/lib/adminDb';

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<RoleDef[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?slice=roles')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setRoles(res.data);
        }
      });
  }, []);

  const permissionMatrix = [
    { module: 'Sản phẩm & Danh mục', view: true, create: true, edit: true, del: true },
    { module: 'Quản lý kho & Xuất nhập tồn', view: true, create: true, edit: true, del: false },
    { module: 'Bán hàng tại quầy (POS)', view: true, create: true, edit: true, del: false },
    { module: 'Đơn hàng & Đổi trả', view: true, create: true, edit: true, del: true },
    { module: 'Khách hàng & CRM', view: true, create: true, edit: true, del: false },
    { module: 'Báo cáo & Tài chính', view: true, create: false, edit: false, del: false },
    { module: 'Cấu hình hệ thống & Phân quyền', view: true, create: true, edit: true, del: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Phân Quyền Vai Trò (Role-Based Access Control - RBAC)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quy định quyền hạn chi tiết (Xem / Thêm / Sửa / Xóa / Duyệt / Xuất Excel) cho từng bộ phận.
          </p>
        </div>
      </div>

      {/* Roles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div
            key={r.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{r.name}</h3>
              <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {r.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>

      {/* Permission Matrix Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Ma Trận Quyền Hạn Chi Tiết Cho Nhóm: Quản Lý Kho & Vận Hành</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Phân Hệ Nghiệp Vụ</th>
                <th className="p-3 text-center">Xem (View)</th>
                <th className="p-3 text-center">Thêm Mới (Create)</th>
                <th className="p-3 text-center">Chỉnh Sửa (Edit)</th>
                <th className="p-3 text-center">Xóa Bỏ (Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {permissionMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{p.module}</td>
                  <td className="p-3 text-center">
                    <span className="text-emerald-400 font-bold">✓ Cho phép</span>
                  </td>
                  <td className="p-3 text-center">
                    {p.create ? (
                      <span className="text-emerald-400 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.edit ? (
                      <span className="text-emerald-400 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {p.del ? (
                      <span className="text-red-400 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-600 font-bold">✕ Cấm</span>
                    )}
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
