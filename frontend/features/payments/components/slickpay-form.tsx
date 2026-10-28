import React from 'react'
import { Lock, RefreshCw } from 'lucide-react'

interface SlickPayFormProps {
  cardType: 'edahabia' | 'cib'
  setCardType: (t: 'edahabia' | 'cib') => void
  cardNumber: string
  onCardNumberChange: (val: string) => void
  cardHolder: string
  setCardHolder: (val: string) => void
  cardExpiry: string
  setCardExpiry: (val: string) => void
  cardCvv: string
  setCardCvv: (val: string) => void
  amount: number
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function SlickPayForm({
  cardType,
  setCardType,
  cardNumber,
  onCardNumberChange,
  cardHolder,
  setCardHolder,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  amount,
  loading,
  onSubmit,
}: SlickPayFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-slate-600 text-[11px] font-medium">نوع البطاقة:</span>
        <button
          type="button"
          onClick={() => setCardType('edahabia')}
          className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition ${
            cardType === 'edahabia'
              ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          البطاقة الذهبية (Algérie Poste)
        </button>
        <button
          type="button"
          onClick={() => setCardType('cib')}
          className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition ${
            cardType === 'cib'
              ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          بطاقة بنكية (CIB SATIM)
        </button>
      </div>

      <div
        className={`p-4 rounded-2xl border shadow-md relative overflow-hidden transition-all duration-300 ${
          cardType === 'edahabia'
            ? 'bg-gradient-to-tr from-[#92400e] via-[#b45309] to-[#d97706] text-white border-amber-600'
            : 'bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#334155] text-white border-slate-700'
        }`}
        dir="ltr"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="w-9 h-7 rounded bg-amber-300 flex items-center justify-center text-[9px] font-mono font-bold text-slate-900 border border-amber-200">
            CHIP
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-100">
            {cardType === 'edahabia' ? 'EDAHABIA · بريد الجزائر' : 'CIB · SATIM EPG'}
          </span>
        </div>
        <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-white mb-3">
          {cardNumber || '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between items-end text-[10px] text-slate-200 font-mono">
          <div>
            <div className="text-[8px] text-slate-300">CARDHOLDER</div>
            <div className="font-bold">{cardHolder || 'RESEARCHER'}</div>
          </div>
          <div>
            <div className="text-[8px] text-slate-300">EXPIRES</div>
            <div className="font-bold">{cardExpiry || 'MM/YY'}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">رقم البطاقة (16 رقم)</label>
          <input
            type="text"
            required
            value={cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            placeholder="4912 0000 0000 0000"
            className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">اسم حامل البطاقة</label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              placeholder="ABDALLAH BACHIR"
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-slate-900 font-mono outline-none uppercase"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">الصلاحية</label>
              <input
                type="text"
                required
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-2 py-2 text-center text-slate-900 font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV2</label>
              <input
                type="password"
                required
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value.slice(0, 3))}
                placeholder="•••"
                maxLength={3}
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-2 py-2 text-center text-slate-900 font-mono outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          <span>المتابعة إلى التحقق وتأكيد الدفع ({amount.toLocaleString()} د.ج)</span>
        </button>
      </div>
    </form>
  )
}
