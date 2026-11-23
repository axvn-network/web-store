'use client';

import React, { useState } from 'react';
import {
  FiDollarSign,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
} from 'react-icons/fi';

const BANKS = [
  'Vietcombank (VCB)',
  'Techcombank (TCB)',
  'MB Bank (Quân Đội)',
  'VietinBank (CTG)',
  'BIDV',
  'ACB',
  'TPBank',
  'Ví MoMo',
];

export default function RutTienPage() {
  const [balance, setBalance] = useState(2840000);
  const [amount, setAmount] = useState('1000000');
  const [method, setMethod] = useState<'BANK' | 'MOMO'>('BANK');
  const [bankName, setBankName] = useState(BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('1903482910398');
  const [accountHolder, setAccountHolder] = useState('NGUYEN VAN AN');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [history, setHistory] = useState([
    {
      id: 'w-1',
      code: 'WD-2026-102',
      amount: 415800,
      bank: 'Techcombank • 1903****398',
      status: 'APPROVED',
      statusText: 'Đã chuyển tiền',
      date: '30/10/2026 10:15',
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    const numAmount = parseInt(amount, 10);

    if (isNaN(numAmount) || numAmount < 200000) {
      alert('Số tiền rút tối thiểu là 200.000 ₫');
      return;
    }

    if (numAmount > balance) {
      alert('Số tiền rút vượt quá số dư khả dụng');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setBalance(balance - numAmount);
      const newReq = {
        id: `w-${Date.now()}`,
        code: `WD-${Date.now().toString().slice(-6)}`,
        amount: numAmount,
        bank: `${bankName} • ${accountNumber}`,
        status: 'PENDING',
        statusText: 'Chờ duyệt',
        date: 'Vừa xong',
      };
      setHistory([newReq, ...history]);
      setSuccessMsg(`Đã tạo yêu cầu rút ${numAmount.toLocaleString('vi-VN')} ₫ thành công! Tiền sẽ được chuyển về tài khoản của bạn trong vòng 24 giờ.`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Balance & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f53d2d] flex items-center justify-center text-lg">
              <FiDollarSign />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Yêu cầu rút tiền hoa hồng</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Chuyển thẳng về tài khoản ngân hàng hoặc ví MoMo nhanh chóng
              </p>
            </div>
          </div>

          {successMsg && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2">
              <FiCheckCircle className="text-base text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Số tiền muốn rút (VNĐ) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={200000}
                  max={balance}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                />
                <span className="absolute right-4 top-2.5 text-xs text-gray-400 font-bold">VND</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                <span>Tối thiểu: 200.000 ₫</span>
                <button
                  type="button"
                  onClick={() => setAmount(balance.toString())}
                  className="text-[#f53d2d] font-bold hover:underline"
                >
                  Rút toàn bộ số dư
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Hình thức nhận tiền
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                >
                  <option value="BANK">Tài khoản Ngân hàng (Napas 247)</option>
                  <option value="MOMO">Ví điện tử MoMo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Ngân hàng thụ hưởng
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                >
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Số tài khoản / Số MoMo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tên chủ tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-[#f53d2d] focus:border-[#f53d2d]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || balance < 200000}
                className="w-full py-3 bg-[#f53d2d] hover:bg-[#e03122] text-white font-bold rounded-xl text-xs shadow-md shadow-[#f53d2d]/20 transition disabled:opacity-50"
              >
                {submitting ? 'Đang gửi yêu cầu...' : 'Tạo lệnh rút tiền'}
              </button>
            </div>
          </form>
        </div>

        {/* Balance Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#f53d2d] via-[#ff5522] to-[#ff7744] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col justify-between h-full">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-100">
                Ví hoa hồng BetaShop
              </span>
              <h3 className="text-3xl font-black mt-2 tracking-tight">
                {balance.toLocaleString('vi-VN')} ₫
              </h3>
              <p className="text-xs text-orange-100 mt-1">Số dư sẵn sàng rút về tài khoản cá nhân</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 space-y-2 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <FiCheckCircle className="text-yellow-300" />
                <span>Không thu phí rút tiền</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-yellow-300" />
                <span>Thời gian xử lý: 2-24 giờ làm việc</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-yellow-300" />
                <span>Hỗ trợ hơn 40 ngân hàng Napas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-gray-900">Lịch sử các lần rút tiền</h3>
            <p className="text-xs text-gray-400 mt-0.5">Theo dõi tình trạng giải ngân tiền về tài khoản ngân hàng của bạn</p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {history.length} Giao dịch
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Mã giao dịch</th>
                <th className="py-3 px-4">Số tiền rút</th>
                <th className="py-3 px-4">Tài khoản nhận</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-gray-800">{h.code}</td>
                  <td className="py-3.5 px-4 font-black text-purple-600 text-sm">
                    {h.amount.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">{h.bank}</td>
                  <td className="py-3.5 px-4">
                    {h.status === 'APPROVED' ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        {h.statusText}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                        {h.statusText}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
