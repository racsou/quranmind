'use client'

import React, { useState } from 'react'
import { ShieldCheck, X, AlertCircle, CreditCard, DollarSign } from 'lucide-react'
import { PlanTier, getPlanAmount, getPlanTitle } from '@/config/plans'
import { PlanSummaryBanner } from './plan-summary-banner'
import { SlickPayForm } from './slickpay-form'
import { StripeForm } from './stripe-form'
import { OtpConfirmationStep } from './otp-confirmation-step'
import { PaymentSuccessStep } from './payment-success-step'

export interface PaymentCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan: PlanTier
  initialGateway?: 'slickpay' | 'stripe'
  userEmail: string
  userName: string
  userId?: string
  onPaymentSuccess: (invoice: any) => void
}

export function CheckoutModal({
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
  const [cardType, setCardType] = useState<'edahabia' | 'cib'>('edahabia')
  const [cardNumber, setCardNumber] = useState('4912 8490 2147 6382')
  const [cardHolder, setCardHolder] = useState(userName || 'ABDALLAH BACHIR')
  const [cardExpiry, setCardExpiry] = useState('09/28')
  const [cardCvv, setCardCvv] = useState('742')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string>('')
  const [invoiceSerial, setInvoiceSerial] = useState<string>('')
  const [finalInvoice, setFinalInvoice] = useState<any>(null)

  if (!isOpen) return null

  const isDZD = gateway === 'slickpay'
  const currency = isDZD ? 'DZD' : 'USD'
  const amount = getPlanAmount(plan, currency)
  const planName = getPlanTitle(plan)

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16)
    setCardNumber(raw.replace(/(\d{4})(?=\d)/g, '$1 '))
  }

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, gateway, currency, email: userEmail, userId, name: userName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'تعذر إنشاء فاتورة الدفع')

      setPaymentId(data.data.paymentId)
      setInvoiceSerial(data.data.invoiceSerial)
      if (gateway === 'slickpay') {
        setStep('otp')
      } else {
        await executeConfirmation(data.data.paymentId, data.data.invoiceSerial)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء معالجة البوابة')
    } finally {
      setLoading(false)
    }
  }

  const executeConfirmation = async (pId?: string, serial?: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: pId || paymentId,
          invoiceSerial: serial || invoiceSerial,
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
      if (!data.success) throw new Error(data.error || 'فشل تأكيد عملية الدفع')
      setFinalInvoice(data.data?.invoice || data.invoice)
      onPaymentSuccess(data.data?.invoice || data.invoice)
      setStep('success')
    } catch (err: any) {
      setError(err.message || 'تعذر تأكيد السداد')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">بوابة الدفع الإلكتروني المعتمدة</h2>
              <p className="text-[11px] text-slate-500">QuranMind Secure Checkout · معالجة مشفرة وآمنة</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer" title="إغلاق">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'form' && (
          <div className="space-y-4">
            <PlanSummaryBanner plan={plan} planName={planName} isDZD={isDZD} amount={amount} />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setGateway('slickpay')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition cursor-pointer ${
                  gateway === 'slickpay' ? 'bg-teal-50 border-teal-600 text-teal-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span>🇩🇿 SlickPay (SATIM / الذهبية)</span>
              </button>
              <button
                type="button"
                onClick={() => setGateway('stripe')}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition cursor-pointer ${
                  gateway === 'stripe' ? 'bg-sky-50 border-sky-600 text-sky-800 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <DollarSign className="w-4 h-4 text-sky-700" />
                <span>🌐 Stripe (Visa / Mastercard)</span>
              </button>
            </div>
            {gateway === 'slickpay' ? (
              <SlickPayForm
                cardType={cardType} setCardType={setCardType} cardNumber={cardNumber} onCardNumberChange={handleCardNumberChange}
                cardHolder={cardHolder} setCardHolder={setCardHolder} cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
                cardCvv={cardCvv} setCardCvv={setCardCvv} amount={amount} loading={loading} onSubmit={handleInitiatePayment}
              />
            ) : (
              <StripeForm userEmail={userEmail} amount={amount} loading={loading} onSubmit={handleInitiatePayment} />
            )}
          </div>
        )}

        {step === 'otp' && (
          <OtpConfirmationStep
            amount={amount} invoiceSerial={invoiceSerial} otpCode={otpCode} onOtpCodeChange={setOtpCode}
            loading={loading} onBack={() => setStep('form')} onSubmit={(e) => { e.preventDefault(); executeConfirmation(); }}
          />
        )}

        {step === 'success' && (
          <PaymentSuccessStep
            planName={planName} amount={amount} isDZD={isDZD} gateway={gateway}
            invoiceSerial={invoiceSerial} finalInvoice={finalInvoice} onClose={onClose}
          />
        )}
      </div>
    </div>
  )
}
