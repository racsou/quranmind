'use client'

import React, { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  X,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
} from 'lucide-react'

export interface PaymentCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan: 'pro' | 'patron'
  initialGateway?: 'slickpay' | 'stripe'
  userEmail: string
  userName: string
  userId?: string
  onPaymentSuccess: (invoice: any) => void
}

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  plan = 'pro',
  initialGateway = 'slickpay',
  userEmail,
  userName,
  userId,
  onPaymentSuccess,
}: PaymentCheckoutModalProps) {
  const [gateway, setGateway] = useState<'slickpay' | 'stripe'>(initialGateway)
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form')

  // Card Form State
  const [cardType, setCardType] = useState<'edahabia' | 'cib'>('edahabia')
  const [cardNumber, setCardNumber] = useState('4912 8490 2147 6382')
  const [cardHolder, setCardHolder] = useState(userName || 'ABDALLAH BACHIR')
  const [cardExpiry, setCardExpiry] = useState('09/28')
  const [cardCvv, setCardCvv] = useState('742')
  const [otpCode, setOtpCode] = useState('')

  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string>('')
  const [invoiceSerial, setInvoiceSerial] = useState<string>('')
  const [finalInvoice, setFinalInvoice] = useState<any>(null)

  if (!isOpen) return null

  const isDZD = gateway === 'slickpay'
  const amount = plan === 'patron' ? (isDZD ? 5000 : 49) : (isDZD ? 2500 : 19)
  const currency = isDZD ? 'DZD' : 'USD'
  const planName = plan === 'patron' ? 'باقة الوقف الرقمي العالمي (Patron)' : 'باقة المحقق الأكاديمي (Pro Scholar)'

  // Format card number with spaces
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(formatted)
  }

  // Handle Init Payment Order
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Create order
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          gateway,
          currency,
          email: userEmail,
          userId,
          name: userName,
        }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'تعذر إنشاء فاتورة الدفع')
      }

      setPaymentId(data.data.paymentId)
      setInvoiceSerial(data.data.invoiceSerial)

      if (gateway === 'slickpay') {
        // Proceed to 3D Secure SMS OTP step
        setStep('otp')
      } else {
        // Stripe instant simulation or redirect
        await executeConfirmation(data.data.paymentId, data.data.invoiceSerial)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء معالجة البوابة')
    } finally {
      setLoading(false)
    }
  }

  // Handle Confirm Payment
  const executeConfirmation = async (pId?: string, serial?: string) => {
    setLoading(true)
    setError(null)

    try {
      const activePId = pId || paymentId
      const activeSerial = serial || invoiceSerial

      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: activePId,
          invoiceSerial: activeSerial,
          email: userEmail,
          gateway,
          plan,
          currency,
          amount,
          cardNumber,
          cardType,
        }),
      })

      const data = await res.json()
      if (!data.success) {
        throw new Error(data.error || 'فشل تأكيد عملية الدفع')
      }

      setFinalInvoice(data.invoice)
      onPaymentSuccess(data.invoice)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'تعذر تأكيد السداد')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeConfirmation()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-xl bg-[#031527] border border-cyan-800/70 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/90 overflow-hidden text-slate-100">
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                بوابة الدفع الإلكتروني المعتمدة
              </h2>
              <p className="text-[11px] text-slate-400">
                QuranMind Secure Checkout · معالجة مشفرة وآمنة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Card Form & Gateway Selection */}
        {step === 'form' && (
          <div className="space-y-4">
            {/* Selected Plan Summary Banner */}
            <div className="p-3.5 bg-[#051f38] border border-cyan-700/50 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">
                  الباقة المختارة للترقية:
                </span>
                <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  {plan === 'patron' ? <Award className="w-4 h-4 text-amber-400" /> : <BookOpen className="w-4 h-4 text-cyan-400" />}
                  <span>{planName}</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-black text-cyan-300">
                  {isDZD ? `${amount.toLocaleString()} د.ج` : `$${amount}`}
                </span>
                <small className="block text-[10px] text-slate-400">شهرياً (بدون رسوم إضافية)</small>
              </div>
            </div>

            {/* Gateway Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGateway('slickpay')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                  gateway === 'slickpay'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/40'
                    : 'bg-[#020e1d] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>🇩🇿 SlickPay (SATIM / الذهبية)</span>
              </button>

              <button
                type="button"
                onClick={() => setGateway('stripe')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                  gateway === 'stripe'
                    ? 'bg-blue-950/90 border-blue-500 text-blue-300 shadow-md shadow-blue-950/40'
                    : 'bg-[#020e1d] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span>🌐 Stripe (Visa / Mastercard)</span>
              </button>
            </div>

            {/* SlickPay SATIM Flow */}
            {gateway === 'slickpay' && (
              <form onSubmit={handleInitiatePayment} className="space-y-3.5 text-xs">
                {/* Card Type Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">نوع البطاقة:</span>
                  <button
                    type="button"
                    onClick={() => setCardType('edahabia')}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition ${
                      cardType === 'edahabia'
                        ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                        : 'bg-[#020e1d] border-slate-800 text-slate-400'
                    }`}
                  >
                    البطاقة الذهبية (Algérie Poste)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardType('cib')}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition ${
                      cardType === 'cib'
                        ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300'
                        : 'bg-[#020e1d] border-slate-800 text-slate-400'
                    }`}
                  >
                    بطاقة بنكية (CIB SATIM)
                  </button>
                </div>

                {/* Visual Card Mockup */}
                <div
                  className={`p-4 rounded-2xl border shadow-xl relative overflow-hidden transition-all duration-300 ${
                    cardType === 'edahabia'
                      ? 'bg-gradient-to-tr from-[#1b1704] via-[#2d2206] to-[#453609] border-amber-500/50'
                      : 'bg-gradient-to-tr from-[#02182c] via-[#042442] to-[#073663] border-cyan-500/50'
                  }`}
                  dir="ltr"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-9 h-7 rounded bg-amber-400/80 flex items-center justify-center text-[9px] font-mono font-bold text-slate-950 border border-amber-300">
                      CHIP
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-200">
                      {cardType === 'edahabia' ? 'EDAHABIA · بريد الجزائر' : 'CIB · SATIM EPG'}
                    </span>
                  </div>

                  <div className="font-mono text-base sm:text-lg font-bold tracking-widest text-slate-100 mb-3">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end text-[10px] text-slate-300 font-mono">
                    <div>
                      <div className="text-[8px] text-slate-400">CARDHOLDER</div>
                      <div className="font-bold">{cardHolder || 'RESEARCHER'}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-slate-400">EXPIRES</div>
                      <div className="font-bold">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      رقم البطاقة (16 رقم)
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="4912 0000 0000 0000"
                      className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-mono outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        اسم حامل البطاقة
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="ABDALLAH BACHIR"
                        className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-white font-mono outline-none uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          الصلاحية
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-2 py-2 text-center text-white font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          CVV2
                        </label>
                        <input
                          type="password"
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.slice(0, 3))}
                          placeholder="•••"
                          maxLength={3}
                          className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-2 py-2 text-center text-white font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    <span>المتابعة إلى التحقق وتأكيد الدفع ({amount.toLocaleString()} د.ج)</span>
                  </button>
                </div>
              </form>
            )}

            {/* Stripe Flow */}
            {gateway === 'stripe' && (
              <form onSubmit={handleInitiatePayment} className="space-y-3.5 text-xs">
                <div className="p-4 bg-[#020e1d] border border-blue-900/60 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">الدفع بالدولار عبر Stripe Checkout</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-800">
                      Visa / Mastercard / Amex
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    سيتم خصم مبلغ <strong className="text-white">${amount} USD</strong> شهرياً مع إمكانية الإلغاء في أي وقت.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    البريد الإلكتروني المسجل للفاتورة
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full bg-[#020e1d] border border-slate-800 rounded-xl px-3 py-2 text-slate-400 outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-700/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                    <span>إتمام الدفع عبر Stripe (${amount} USD)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: SATIM 3D Secure SMS OTP Confirmation */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 animate-fade-in text-xs">
            <div className="text-center space-y-2 py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center mx-auto text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                تأكيد العملية — SATIM 3D Secure SMS OTP
              </h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                تم إرسال رمز أمان الدفع (OTP) عبر رسالة قصيرة SMS إلى هاتفك المحمول المسجل.
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-[#020e1d] py-1 px-3 rounded-full inline-block border border-cyan-900">
                المبلغ المطلوب: {amount.toLocaleString()} د.ج · رقم المعاملة: {invoiceSerial}
              </div>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <label className="block text-center text-[11px] font-semibold text-slate-300">
                أدخل رمز التأكيد (OTP):
              </label>
              <input
                type="text"
                autoFocus
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full bg-[#020e1d] border border-cyan-700 focus:border-cyan-400 rounded-xl py-2.5 text-center text-xl font-mono font-bold text-white tracking-widest outline-none"
              />
              <p className="text-[10px] text-slate-500 text-center">
                رمز الاختبار السريع: <code className="text-cyan-400 font-mono">123456</code>
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="py-2.5 px-4 bg-[#020e1d] hover:bg-[#051c33] border border-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                تعديل البطاقة
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold rounded-xl shadow-lg shadow-emerald-700/30 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>تأكيد السداد وتفعيل الباقة الآن</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment Success Receipt Screen */}
        {step === 'success' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="text-center space-y-1.5 py-1">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                تم اعتماد الدفع وتفعيل الباقة بنجاح!
              </h3>
              <p className="text-[11px] text-emerald-400">
                أصبح الوكيل الذكي (Google Gemini 2.5) ومختبر التناظر متاحين في حسابك الآن.
              </p>
            </div>

            {/* Official Invoice Receipt Card */}
            <div className="p-4 bg-[#020e1d] border border-cyan-800/60 rounded-2xl space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">رقم الفاتورة الرسمية:</span>
                <strong className="font-mono text-cyan-300 font-bold">{finalInvoice?.serial || invoiceSerial}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">الباقة المفعلة:</span>
                <strong className="text-white">{planName}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">المبلغ المسدد:</span>
                <strong className="text-emerald-400 font-bold font-mono">
                  {isDZD ? `${amount.toLocaleString()} د.ج` : `$${amount} USD`}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">بوابة الدفع:</span>
                <span className="text-slate-200">
                  {gateway === 'slickpay' ? 'SlickPay (SATIM EPG)' : 'Stripe Payments'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">حالة العملية:</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                  مدفوع ومعتمد ✓
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#020e1d] hover:bg-[#051c33] border border-cyan-800 text-cyan-300 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة إيصال الدفع</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-700/30 transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>العودة إلى لوحة التحكم</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
