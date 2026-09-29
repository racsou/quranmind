'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'
import {
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

type AccountType = 'student' | 'scholar' | 'patron' | 'skipped'

export default function SignupPage() {
  const [step, setStep] = useState<'select-role' | 'register'>('select-role')
  const [selectedRole, setSelectedRole] = useState<AccountType>('student')

  const handleSelectRole = (role: AccountType) => {
    setSelectedRole(role)
    const effectiveRole = role === 'skipped' ? 'student' : role
    try {
      localStorage.setItem('qm_signup_role', effectiveRole)
      localStorage.setItem('qm_account_type_selected', role)
    } catch {}
    setStep('register')
  }

  const handleSkip = () => {
    handleSelectRole('skipped')
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#072440] via-[#020b18] to-[#01060e] text-slate-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-2xl bg-[#031527]/95 border border-cyan-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/70 backdrop-blur-md relative overflow-hidden">
        {/* Glow corners */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-cyan-900/40">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <strong className="text-base font-extrabold text-white tracking-wide">
                Quran<span className="text-cyan-400">Mind</span>
              </strong>
              <small className="block text-[10px] text-slate-400 font-medium">القرآن · علم · حقيقة</small>
            </div>
          </Link>

          <span className="text-xs text-slate-400">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline">
              تسجيل الدخول
            </Link>
          </span>
        </div>

        {/* STEP 1: Select Account Type */}
        {step === 'select-role' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> الخطوة 1 من 2: اختيار نوع الحساب البحثي
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                اختر نوع الحساب الذي يناسب مسارك البحثي
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                يمكنك تحديد نوع الحساب الآن للبدء بالميزات المخصصة، أو التخطي والاستكشاف واختيار الخطة لاحقاً.
              </p>
            </div>

            {/* Account Type Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Card 1: Student / Explorer */}
              <div
                onClick={() => handleSelectRole('student')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group ${
                  selectedRole === 'student'
                    ? 'bg-[#052542] border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#020e1d] border-slate-800 hover:border-cyan-700/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      طالب علم / مستكشف
                    </h3>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
                      مجاني بالكامل (Free)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    تصفح المصحف الشريف بالرسم العثماني، الاستماع لتلاوات كبار القراء، وقراءة التفسير المعتمد.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>اختيار ومتابعة</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 2: Academic Scholar */}
              <div
                onClick={() => handleSelectRole('scholar')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group relative overflow-hidden ${
                  selectedRole === 'scholar'
                    ? 'bg-[#052542] border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#020e1d] border-slate-800 hover:border-cyan-700/80'
                }`}
              >
                <span className="absolute top-2 left-2 text-[9px] bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                  الأكثر طلباً
                </span>
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-blue-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      باحث ومحقق أكاديمي
                    </h3>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                      المحقق (Pro Scholar)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    وصول للوكيل الذكي (Google Gemini 2.5)، مختبر التناظر، حساب الجُمّل، أسانيد الحديث، وتصدير الأبحاث.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>اختيار ومتابعة</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
                </div>
              </div>

              {/* Card 3: Endowment / Patron */}
              <div
                onClick={() => handleSelectRole('patron')}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 group ${
                  selectedRole === 'patron'
                    ? 'bg-[#052542] border-cyan-400 shadow-lg shadow-cyan-950/60'
                    : 'bg-[#020e1d] border-slate-800 hover:border-cyan-700/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      مؤسسة وقفية / راعٍ
                    </h3>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
                      الوقف الرقمي (Patron)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    دعم مشاريع القرآن الرقمية، بنية تحتية خاصة، وأولوية معالجة قصوى لكافة المشاريع والطلبة.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>اختيار ومتابعة</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
                </div>
              </div>
            </div>

            {/* Skip Option */}
            <div className="pt-4 border-t border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                لست متأكداً وتريد الاستكشاف أولاً؟
              </span>
              <button
                type="button"
                onClick={handleSkip}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#020e1d] hover:bg-[#062444] border border-cyan-800/60 text-cyan-300 hover:text-white font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>تخطي والاستكشاف كزائر (تحديد الحساب عند اختيار الخطة لاحقاً)</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Registration Form */}
        {step === 'register' && (
          <div className="space-y-5 animate-fade-in">
            {/* Selected Role Badge & Back button */}
            <div className="flex items-center justify-between p-3 bg-[#020e1d] border border-cyan-900/60 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">نوع الحساب المحدد:</span>
                <strong className="text-cyan-300 font-bold">
                  {selectedRole === 'scholar'
                    ? 'باحث ومحقق أكاديمي (Scholar)'
                    : selectedRole === 'patron'
                    ? 'مؤسسة وقفية / راعٍ (Patron)'
                    : selectedRole === 'skipped'
                    ? 'مستكشف زائر (تحديد الحساب لاحقاً)'
                    : 'طالب علم / مستكشف (Student)'}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setStep('select-role')}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold hover:underline"
              >
                تغيير النوع ←
              </button>
            </div>

            {hasValidKey ? (
              <div className="clerk-container">
                <SignUp routing="hash" fallbackRedirectUrl="/dashboard" />
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const nameInput = (form.elements.namedItem('fullName') as HTMLInputElement)?.value
                  const emailInput = (form.elements.namedItem('email') as HTMLInputElement)?.value

                  // Sync to Supabase
                  try {
                    await fetch('/api/user/profile', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        id: `usr-${Date.now()}`,
                        name: nameInput || 'باحث قرآني',
                        email: emailInput,
                        role: selectedRole === 'skipped' ? 'student' : selectedRole,
                        plan: selectedRole === 'scholar' ? 'pro' : selectedRole === 'patron' ? 'patron' : 'free',
                      }),
                    })
                  } catch {}

                  window.location.href = '/dashboard'
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الاسم الكامل</label>
                  <input
                    name="fullName"
                    type="text"
                    placeholder="راشد علي القاسمي"
                    required
                    className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">البريد الإلكتروني</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="researcher@quranmind.ai"
                    required
                    className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">كلمة المرور</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#020e1d] border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
                >
                  <span>إتمام التسجيل والدخول إلى مساحة العمل</span>
                  <ArrowLeft className="w-4 h-4 mr-1 inline" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
