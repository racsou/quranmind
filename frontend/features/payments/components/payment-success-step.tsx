import React from 'react'
import { CheckCircle2, Printer, Sparkles } from 'lucide-react'

interface PaymentSuccessStepProps {
  planName: string
  amount: number
  isDZD: boolean
  gateway: 'slickpay' | 'stripe'
  invoiceSerial: string
  finalInvoice: any
  onClose: () => void
}

export function PaymentSuccessStep({
  planName,
  amount,
  isDZD,
  gateway,
  invoiceSerial,
  finalInvoice,
  onClose,
}: PaymentSuccessStepProps) {
  return (
    <div className="space-y-4 animate-fade-in text-xs">
      <div className="text-center space-y-1.5 py-1">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-teal-700 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-extrabold text-slate-800">
          تم اعتماد الدفع وتفعيل الباقة بنجاح!
        </h3>
        <p className="text-[11px] text-teal-700 font-medium">
          أصبح الوكيل الذكي (Google Gemini 2.5) ومختبر التناظر متاحين في حسابك الآن.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-[11px]">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <span className="text-slate-500">رقم الفاتورة الرسمية:</span>
          <strong className="font-mono text-teal-800 font-bold">
            {finalInvoice?.serial || invoiceSerial}
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">الباقة المفعلة:</span>
          <strong className="text-slate-800">{planName}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">المبلغ المسدد:</span>
          <strong className="text-teal-700 font-bold font-mono">
            {isDZD ? `${amount.toLocaleString()} د.ج` : `$${amount} USD`}
          </strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">بوابة الدفع:</span>
          <span className="text-slate-700">
            {gateway === 'slickpay' ? 'SlickPay (SATIM EPG)' : 'Stripe Payments'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">حالة العملية:</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-teal-50 text-teal-800 border border-teal-300 font-bold">
            مدفوع ومعتمد ✓
          </span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة إيصال الدفع</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>العودة إلى لوحة التحكم</span>
        </button>
      </div>
    </div>
  )
}
