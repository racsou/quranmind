'use client'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import { ArrowLeft, Sparkles, BrainCircuit } from 'lucide-react'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default function LoginPage() {
  return (
    <main className="auth-page" dir="rtl">
      {hasValidKey ? (
        <div className="clerk-container">
          <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
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
          <h1>مرحباً بعودتك</h1>
          <p>سجل الدخول إلى مساحة البحث القرآني المدعومة بالذكاء الاصطناعي.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              window.location.href = '/dashboard'
            }}
          >
            <label>
              البريد الإلكتروني
              <input type="email" defaultValue="researcher@quranmind.ai" required />
            </label>
            <label>
              كلمة المرور
              <input type="password" defaultValue="••••••••" required />
            </label>
            <button type="submit">
              الدخول إلى لوحة التحكم والبحث <ArrowLeft className="w-4 h-4 mr-2 inline" />
            </button>
          </form>

          <div className="text-xs text-slate-400 mt-3 p-2 border border-slate-800 rounded bg-slate-900/60">
            <Sparkles className="w-3.5 h-3.5 inline text-cyan-400 ml-1" />
            <span>نظام تسجيل الدخول مدعوم عبر <strong>Clerk</strong>. تم تفعيل نمط المعاينة للبدء الفوري.</span>
          </div>

          <span>
            ليس لديك حساب؟ <Link href="/signup">إنشاء حساب جديد</Link>
          </span>
        </div>
      )}
    </main>
  )
}
