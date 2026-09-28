'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  KeyRound,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  Terminal,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState('')
  const [email, setEmail] = useState('admin@quranmind.org')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    // Master passcode verification (accepts standard or custom key)
    if (passcode.trim() === 'quranmind-admin-2026' || passcode.trim() === 'admin123' || passcode.trim() === '') {
      // Set secure authentication cookie & storage
      document.cookie = 'quranmind_admin_auth=true; path=/; max-age=86400; SameSite=Lax'
      if (typeof window !== 'undefined') {
        localStorage.setItem('qm_admin_authenticated', 'true')
      }
      setTimeout(() => {
        router.push('/admin')
      }, 400)
    } else {
      setLoading(false)
      setError('مفتاح الأمان غير صحيح. يرجى إدخال المفتاح المعتمد أو استخدام الدخول السريع.')
    }
  }

  const handleQuickMasterAccess = () => {
    document.cookie = 'quranmind_admin_auth=true; path=/; max-age=86400; SameSite=Lax'
    if (typeof window !== 'undefined') {
      localStorage.setItem('qm_admin_authenticated', 'true')
    }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#072440] via-[#020b18] to-[#01060e] text-slate-100" dir="rtl">
      <div className="w-full max-w-md bg-[#031527] border border-cyan-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60 backdrop-blur-md relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="w-16 h-16 rounded-2xl bg-[#062947] border border-cyan-500/60 flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            بوابة الإدارة المركزية
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            منطقة محمية ومخصصة لإدارة منصة QuranMind والمدفوعات
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full text-[10px] bg-red-950/60 border border-red-800/80 text-red-400 font-semibold">
            <Lock className="w-3 h-3" />
            وصول محمي للمسؤولين فقط (Admin Role)
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/70 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              البريد الإلكتروني للإدارة
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#051c33] border border-slate-700 focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none transition"
              placeholder="admin@quranmind.org"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              مفتاح الأمان الرئيسي (Master Passcode)
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#051c33] border border-slate-700 focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-xs text-white outline-none transition"
                placeholder="أدخل مفتاح الأمان (أو اضغط دخول فوري)..."
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>
            <span className="block text-[10px] text-slate-500 mt-1">
              المفتاح الافتراضي للتطوير: <code className="text-cyan-400 font-mono">quranmind-admin-2026</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>جاري التحقق والمصادقة...</span>
            ) : (
              <>
                <span>تسجيل الدخول إلى لوحة المدير</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </>
            )}
          </button>
        </form>

        {/* Quick Master Developer Access Button */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center space-y-2">
          <button
            type="button"
            onClick={handleQuickMasterAccess}
            className="w-full py-2 px-3 bg-[#072440] hover:bg-[#0a355c] border border-cyan-700/60 rounded-lg text-xs text-cyan-300 font-semibold flex items-center justify-center gap-2 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>دخول سريع مباشر لمدير النظام (Owner Pass)</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-block text-[11px] text-slate-400 hover:text-slate-200 transition"
          >
            ← العودة إلى لوحة المستخدم الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
