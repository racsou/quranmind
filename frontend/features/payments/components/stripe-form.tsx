import React from 'react'
import { DollarSign, RefreshCw } from 'lucide-react'

interface StripeFormProps {
  userEmail: string
  amount: number
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function StripeForm({ userEmail, amount, loading, onSubmit }: StripeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800">الدفع بالدولار عبر Stripe Checkout</span>
          <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-sky-800 rounded border border-sky-300 font-medium">
            Visa / Mastercard / Amex
          </span>
        </div>
        <p className="text-[11px] text-slate-600">
          سيتم خصم مبلغ <strong className="text-slate-900 font-mono">${amount} USD</strong> شهرياً مع إمكانية الإلغاء في أي وقت.
        </p>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
          البريد الإلكتروني المسجل للفاتورة
        </label>
        <input
          type="email"
          value={userEmail}
          disabled
          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 outline-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
          <span>إتمام الدفع عبر Stripe (${amount} USD)</span>
        </button>
      </div>
    </form>
  )
}
