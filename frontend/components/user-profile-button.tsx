'use client'

import React from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'

export function UserProfileButton() {
  return (
    <Link
      href="/dashboard/settings"
      className="flex items-center gap-2 text-xs text-slate-700 hover:text-teal-700 transition group"
      title="إعدادات الباحث والمنصة المحلية"
    >
      <span className="hidden sm:inline text-[11px] font-semibold text-slate-600 group-hover:text-teal-700">
        باحث محلي
      </span>
      <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-800 text-xs shadow-xs group-hover:border-teal-400 group-hover:bg-teal-100 transition">
        <User className="w-4 h-4 text-teal-700" />
      </div>
    </Link>
  )
}
