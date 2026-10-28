import React from 'react'
import Link from 'next/link'
import { BrainCircuit } from 'lucide-react'

interface AuthBrandHeaderProps {
  mode: 'login' | 'signup'
}

export function AuthBrandHeader({ mode }: AuthBrandHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center shadow-md group-hover:scale-105 transition">
          <BrainCircuit className="w-5 h-5 text-white" />
        </div>
        <div>
          <strong className="text-base font-extrabold text-slate-900 tracking-wide">
            Quran<span className="text-teal-700">Mind</span>
          </strong>
          <small className="block text-[10px] text-slate-500 font-medium">القرآن · علم · حقيقة</small>
        </div>
      </Link>

      <span className="text-xs text-slate-500">
        {mode === 'signup' ? (
          <>
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-teal-700 hover:text-teal-800 font-bold underline">
              تسجيل الدخول
            </Link>
          </>
        ) : (
          <>
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-teal-700 hover:text-teal-800 font-bold underline">
              إنشاء حساب جديد
            </Link>
          </>
        )}
      </span>
    </div>
  )
}
