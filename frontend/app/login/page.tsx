'use client'

import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { AuthBrandHeader } from '@/features/auth/components/auth-brand-header'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <AuthBrandHeader mode="login" />

        {hasValidKey ? (
          <div className="clerk-container">
            <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900">مرحباً بعودتك</h1>
              <p className="text-xs text-slate-500">سجل الدخول إلى مساحة البحث القرآني المدعومة بالذكاء الاصطناعي.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = '/dashboard'
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue="researcher@quranmind.ai"
                  required
                  className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">كلمة المرور</label>
                <input
                  type="password"
                  defaultValue="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>الدخول إلى لوحة التحكم والبحث</span>
                <ArrowLeft className="w-4 h-4 mr-1 inline" />
              </button>
            </form>

            <div className="text-xs text-slate-600 p-2.5 border border-teal-200 rounded-xl bg-teal-50/50 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span>نظام تسجيل الدخول مدعوم عبر <strong>Clerk</strong>. تم تفعيل نمط المعاينة للبدء الفوري.</span>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
