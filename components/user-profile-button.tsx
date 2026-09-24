'use client'

import React from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export function UserProfileButton() {
  if (!hasValidKey) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 text-xs text-cyan-300 hover:text-cyan-200 transition"
        title="حساب الباحث التجريبي - انقر لتسجيل الدخول"
      >
        <span className="hidden sm:inline text-[11px] text-slate-300">باحث تجريبي</span>
        <div className="w-8 h-8 rounded-full bg-[#0a4870] border border-cyan-400/60 flex items-center justify-center font-bold text-white text-xs">
          ر
        </div>
      </Link>
    )
  }

  return <UserButton />
}
