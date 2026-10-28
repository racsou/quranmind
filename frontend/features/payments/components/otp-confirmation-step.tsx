import React from 'react'
import { Lock, RefreshCw, CheckCircle2 } from 'lucide-react'

interface OtpConfirmationStepProps {
  amount: number
  invoiceSerial: string
  otpCode: string
  onOtpCodeChange: (val: string) => void
  loading: boolean
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function OtpConfirmationStep({
  amount,
  invoiceSerial,
  otpCode,
  onOtpCodeChange,
  loading,
  onBack,
  onSubmit,
}: OtpConfirmationStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-fade-in text-xs">
      <div className="text-center space-y-2 py-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-700">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">تأكيد العملية — SATIM 3D Secure SMS OTP</h3>
        <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
          تم إرسال رمز أمان الدفع (OTP) عبر رسالة قصيرة SMS إلى هاتفك المحمول المسجل.
        </p>
        <div className="text-[11px] font-mono text-teal-800 bg-teal-50 py-1 px-3 rounded-full inline-block border border-teal-200">
          المبلغ المطلوب: {amount.toLocaleString()} د.ج · رقم المعاملة: {invoiceSerial}
        </div>
      </div>

      <div className="space-y-2 max-w-xs mx-auto">
        <label className="block text-center text-[11px] font-semibold text-slate-700">
          أدخل رمز التأكيد (OTP):
        </label>
        <input
          type="text"
          autoFocus
          required
          value={otpCode}
          onChange={(e) => onOtpCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl py-2.5 text-center text-xl font-mono font-bold text-slate-900 tracking-widest outline-none"
        />
        <p className="text-[10px] text-slate-400 text-center">
          رمز الاختبار السريع: <code className="text-teal-700 font-mono font-bold">123456</code>
        </p>
      </div>

      <div className="pt-2 flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl font-semibold transition cursor-pointer"
        >
          تعديل البطاقة
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>تأكيد السداد وتفعيل الباقة الآن</span>
        </button>
      </div>
    </form>
  )
}
