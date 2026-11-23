'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Plus, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { ShippingZone } from '@/lib/adminDb';

export default function ShippingAdminPage() {
  const [zones, setZones] = useState<ShippingZone[]>([]);

  useEffect(() => {
    fetch('/api/admin/data?slice=shippingZones')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setZones(res.data);
        }
      });
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span>Cấu Hình Vận Chuyển & Phí Giao Hàng Khu Vực</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {zones.length} khu vực
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Thiết lập bảng phí vận chuyển theo tỉnh/thành, giao hàng 2h, tiêu chuẩn và điều kiện miễn phí ship.
          </p>
        </div>
      </div>

      {/* Zones list */}
      <div className="space-y-4">
        {zones.map((z) => (
          <div
            key={z.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">{z.name}</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Đang áp dụng
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Áp dụng cho các tỉnh/thành: <strong>{z.provinces?.join(', ')}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {z.rates?.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{r.title}</span>
                    <span className="text-[11px] text-slate-400">
                      Miễn phí từ: {r.freeThreshold ? formatVND(r.freeThreshold) : 'Không'}
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formatVND(r.fee)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
