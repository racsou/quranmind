'use client'

import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'
import { ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default function SignupPage() {
  return (
    <main className="auth-page" dir="rtl">
      {hasValidKey ? (
        <div className="clerk-container">
          <SignUp routing="hash" fallbackRedirectUrl="/workspace" />
        </div>
      ) : (
        <div className="auth-card">
          <div className="qm-brand">
            <div className="qm-brand-mark">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <strong>
                Quran<span>Mind</span>
              </strong>
              <small>القرآن · علم · حقيقة</small>
            </div>
          </div>
          <h1>أنشئ حسابك البحثي</h1>
          <p>ابدأ بتوثيق ملاحظاتك وتحليلاتك في مساحة عمل علمية متقدمة.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = '/workspace'
            }}
          >
            <label>
              الاسم الكامل
              <input type="text" placeholder="راشد علي" required />
            </label>
            <label>
              البريد الإلكتروني
              <input type="email" placeholder="researcher@quranmind.ai" required />
            </label>
            <label>
              كلمة المرور
              <input type="password" placeholder="••••••••" required />
            </label>
            <button type="submit">
              إنشاء الحساب والبدء <ArrowLeft className="w-4 h-4 mr-2 inline" />
            </button>
          </form>

          <div className="text-xs text-slate-400 mt-3 p-2 border border-slate-800 rounded bg-slate-900/60">
            <Sparkles className="w-3.5 h-3.5 inline text-cyan-400 ml-1" />
            <span>نظام المصادقة مدعوم عبر <strong>Clerk</strong>.</span>
          </div>

          <span>
            لديك حساب بالفعل؟ <Link href="/login">تسجيل الدخول</Link>
          </span>
        </div>
      )}
    </main>
  )
}
