'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  BrainCircuit,
  Lock,
  Sparkles,
} from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [isSimulated, setIsSimulated] = useState(false)

  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    const qEmail = searchParams.get('email')
    const qCode = searchParams.get('code')
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('qm_unverified_email') : null

    const targetEmail = qEmail || storedEmail || 'researcher@quranmind.ai'
    setEmail(targetEmail)

    if (qCode && qCode.length === 6) {
      setDigits(qCode.split(''))
      handleAutoVerify(targetEmail, qCode)
    } else {
      // Auto-send verification email on initial visit if not sent yet
      handleSendVerification(targetEmail, false)
    }
  }, [searchParams])

  // Cooldown timer countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of complete 6-digit code
      const pasted = value.replace(/\D/g, '').slice(0, 6)
      if (pasted.length > 0) {
        const newDigits = [...digits]
        for (let i = 0; i < pasted.length; i++) {
          newDigits[i] = pasted[i]
        }
        setDigits(newDigits)
        const nextIdx = Math.min(pasted.length, 5)
        inputRefs.current[nextIdx]?.focus()
        if (pasted.length === 6) {
          handleVerify(newDigits.join(''))
        }
        return
      }
    }

    const cleanDigit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = cleanDigit
    setDigits(newDigits)

    // Auto-focus next input
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify if all 6 digits entered
    if (cleanDigit && index === 5 && newDigits.every((d) => d !== '')) {
      handleVerify(newDigits.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSendVerification = async (targetEmail: string, showToast = true) => {
    if (!targetEmail) return
    setResending(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      })
      const data = await res.json()
      if (data.success) {
        setResendCooldown(45)
        if (data.code) {
          setDevCode(data.code)
        }
        if (data.simulated) {
          setIsSimulated(true)
        }
        if (showToast) {
          setSuccess(data.message || 'تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.')
          setTimeout(() => setSuccess(null), 4000)
        }
      }
    } catch {
      // ignore
    } finally {
      setResending(false)
    }
  }

  const handleAutoVerify = async (targetEmail: string, codeToVerify: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, code: codeToVerify }),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess('تم تأكيد البريد الإلكتروني بنجاح! جاري تحويلك إلى مساحة العمل...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1200)
      } else {
        setError(data.error || 'رمز التحقق غير صحيح.')
      }
    } catch (e: any) {
      setError(e.message || 'تعذر التحقق من الرمز.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = (codeToVerify?: string) => {
    const finalCode = codeToVerify || digits.join('')
    if (finalCode.length < 6) {
      setError('يرجى إدخال الرمز كاملاً (6 أرقام).')
      return
    }
    handleAutoVerify(email, finalCode)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#072440] via-[#020b18] to-[#01060e] text-slate-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md bg-[#031527]/95 border border-cyan-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/70 backdrop-blur-md relative overflow-hidden">
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20 text-white">
            <Mail className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            تأكيد البريد الإلكتروني
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى:
          </p>
          <div className="mt-1.5 inline-block px-3 py-1 bg-[#020e1d] border border-cyan-900/60 rounded-full text-xs font-mono text-cyan-300">
            {email}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/70 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-700/70 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* 6-Digit PIN Inputs */}
        <div className="space-y-4 my-6">
          <label className="block text-center text-xs font-semibold text-slate-300">
            أدخل رمز التحقق (PIN Code):
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5" dir="ltr">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={loading}
                className="w-11 h-13 sm:w-12 sm:h-14 bg-[#020e1d] border border-cyan-800/60 focus:border-cyan-400 rounded-xl text-center text-xl sm:text-2xl font-mono font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner disabled:opacity-50"
              />
            ))}
          </div>

          {devCode && (
            <div className="p-2.5 bg-cyan-950/60 border border-cyan-800/80 rounded-xl text-center">
              <span className="text-[11px] text-cyan-300 block mb-1">
                {isSimulated
                  ? '💡 الرمز المتولد عبر Nodemailer في خادم الباك اند (Backend):'
                  : '💡 رمز التحقق السريع:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  const arr = devCode.split('').slice(0, 6)
                  setDigits(arr)
                  handleAutoVerify(email, devCode)
                }}
                className="px-3 py-1 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 rounded-lg text-xs font-mono font-bold transition inline-flex items-center gap-1.5"
              >
                <span>تعبئة الرمز تلقائياً [{devCode}] ←</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center">
            رمز الاختبار السريع: <code className="text-cyan-400 font-mono">123456</code> أو الرمز المرسل لصندوق بريدك.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || digits.some((d) => d === '')}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>جاري التحقق وتفعيل الحساب...</span>
            </>
          ) : (
            <>
              <span>تأكيد الحساب والدخول ←</span>
            </>
          )}
        </button>

        {/* Resend Code Section */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 text-center space-y-2">
          <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <span>لم يصلك الرمز؟</span>
            <button
              onClick={() => handleSendVerification(email, true)}
              disabled={resendCooldown > 0 || resending}
              className="text-cyan-400 hover:text-cyan-300 font-semibold disabled:text-slate-500 transition"
            >
              {resendCooldown > 0
                ? `إعادة الإرسال بعد (${resendCooldown}s)`
                : resending
                ? 'جاري الإرسال...'
                : 'إعادة إرسال الرمز'}
            </button>
          </div>

          <div>
            <Link
              href="/login"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition"
            >
              ← العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
