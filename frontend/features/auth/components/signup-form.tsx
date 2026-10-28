import React, { useState } from 'react'
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'

interface SignupFormProps {
  onSuccess: (email: string) => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)
    const form = e.currentTarget
    const emailInput = (form.elements.namedItem('email') as HTMLInputElement)?.value

    try {
      const verifyRes = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyData.success) {
        setFormError(verifyData.error || 'البريد الإلكتروني غير حقيقي أو غير صالح.')
        setIsSubmitting(false)
        return
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('qm_unverified_email', emailInput)
        document.cookie = `qm_unverified_email=${encodeURIComponent(emailInput)}; path=/; max-age=86400; SameSite=Lax`
      }

      onSuccess(emailInput)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الطلب.'
      setFormError(msg)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{formError}</span>
        </div>
      )}
      <div>
        <label className="block text-slate-700 font-semibold mb-1">الاسم الكامل</label>
        <input
          name="fullName"
          type="text"
          placeholder="راشد علي القاسمي"
          required
          className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-semibold mb-1">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          placeholder="researcher@quranmind.ai"
          required
          className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-semibold mb-1">كلمة المرور</label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="w-full bg-slate-50 border border-slate-300 focus:border-teal-600 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
      >
        {isSubmitting ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>إتمام التسجيل والدخول إلى مساحة العمل</span>
            <ArrowLeft className="w-4 h-4 mr-1 inline" />
          </>
        )}
      </button>
    </form>
  )
}
