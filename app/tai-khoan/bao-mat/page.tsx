'use client';

import React, { useState } from 'react';
import { useCustomer } from '@/lib/customerContext';
import {
  FiShield,
  FiSmartphone,
  FiMonitor,
  FiCheck,
  FiX,
  FiKey,
  FiAlertTriangle,
  FiLock,
  FiLogOut,
} from 'react-icons/fi';

export default function BaoMatPage() {
  const { user, updateUser } = useCustomer();
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [totpError, setTotpError] = useState('');

  const [devices, setDevices] = useState([
    {
      id: 'dev-1',
      device: 'Windows PC • Chrome 130',
      ip: '113.190.234.12 (Hà Nội, Việt Nam)',
      lastActive: 'Hiện tại (Thiết bị này)',
      current: true,
    },
    {
      id: 'dev-2',
      device: 'iPhone 15 Pro • Safari',
      ip: '14.161.42.98 (TP. Hồ Chí Minh, Việt Nam)',
      lastActive: 'Hôm qua lúc 21:40',
      current: false,
    },
    {
      id: 'dev-3',
      device: 'Samsung Galaxy S24 • Chrome Mobile',
      ip: '171.244.12.5 (Đà Nẵng, Việt Nam)',
      lastActive: '3 ngày trước',
      current: false,
    },
  ]);

  const handleToggle2FA = () => {
    if (!twoFactor) {
      setShowQrModal(true);
    } else {
      if (confirm('Bạn có chắc muốn tắt xác thực 2 lớp? Tài khoản sẽ giảm mức độ bảo vệ.')) {
        setTwoFactor(false);
        updateUser({ twoFactorEnabled: false });
      }
    }
  };

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setTotpError('Mã xác thực gồm đúng 6 chữ số');
      return;
    }
    setTwoFactor(true);
    updateUser({ twoFactorEnabled: true });
    setShowQrModal(false);
    setTotpCode('');
    setTotpError('');
    alert('Đã kích hoạt xác thực 2 bước (2FA) thành công!');
  };

  const handleRevokeDevice = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
  };

  const handleRevokeAllOther = () => {
    setDevices(devices.filter((d) => d.current));
    alert('Đã đăng xuất khỏi tất cả các thiết bị khác thành công!');
  };

  return (
    <div className="space-y-6">
      {/* 2FA Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0">
              <FiShield />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Xác thực 2 lớp (2FA / TOTP)</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Bảo vệ tài khoản bằng mã bảo mật 6 số từ Google Authenticator hoặc Authy khi đăng nhập
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                twoFactor ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {twoFactor ? 'Đang bật' : 'Chưa kích hoạt'}
            </span>
            <button
              type="button"
              onClick={handleToggle2FA}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                twoFactor ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  twoFactor ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <FiLock className="text-base text-orange-600 shrink-0 mt-0.5" />
            <span>Ngăn chặn 99.9% nguy cơ bị đánh cắp tài khoản</span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <FiSmartphone className="text-base text-blue-600 shrink-0 mt-0.5" />
            <span>Tương thích với Google Authenticator, Authy, Microsoft Authenticator</span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-2.5">
            <FiKey className="text-base text-emerald-600 shrink-0 mt-0.5" />
            <span>Yêu cầu xác nhận mỗi khi thanh toán đơn hàng trên 10 triệu đồng</span>
          </div>
        </div>
      </div>

      {/* Login Sessions & Devices */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Thiết bị đăng nhập gần đây</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Danh sách các thiết bị hiện đang duy trì phiên đăng nhập vào tài khoản của bạn
            </p>
          </div>
          <button
            type="button"
            onClick={handleRevokeAllOther}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition self-start sm:self-auto flex items-center gap-1.5"
          >
            <FiLogOut />
            <span>Đăng xuất thiết bị khác</span>
          </button>
        </div>

        <div className="mt-6 space-y-3.5">
          {devices.map((d) => (
            <div
              key={d.id}
              className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-lg text-gray-600 shrink-0">
                  {d.device.includes('iPhone') || d.device.includes('Samsung') ? (
                    <FiSmartphone />
                  ) : (
                    <FiMonitor />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">{d.device}</h4>
                    {d.current && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        Thiết bị này
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {d.ip} • <span className="text-gray-500 font-medium">{d.lastActive}</span>
                  </p>
                </div>
              </div>

              {!d.current && (
                <button
                  type="button"
                  onClick={() => handleRevokeDevice(d.id)}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 transition"
                >
                  Thu hồi quyền
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2FA QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center relative">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <FiX className="text-xl" />
            </button>

            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              <FiKey />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Cài đặt Google Authenticator</h3>
            <p className="text-xs text-gray-500 mb-5">
              Quét mã QR dưới đây bằng ứng dụng Google Authenticator hoặc Authy trên điện thoại
            </p>

            {/* QR Mock code */}
            <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl inline-block mb-4 shadow-sm">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=otpauth://totp/BetaShop:an.nguyen@gmail.com?secret=JBSWY3DPEHPK3PXP&issuer=BetaShop"
                alt="2FA QR Code"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>

            <div className="mb-5 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              Khóa cài đặt thủ công: <strong className="font-mono text-gray-900">JBSW Y3DP EHPK 3PXP</strong>
            </div>

            {totpError && (
              <p className="text-xs text-red-600 mb-3 font-semibold">{totpError}</p>
            )}

            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập 6 số từ ứng dụng (VD: 123456)"
                className="w-full text-center text-lg tracking-widest font-mono font-bold py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Xác nhận và Kích hoạt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
