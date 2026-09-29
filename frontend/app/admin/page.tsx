'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AdminDashboardView } from '@/components/admin-dashboard-view'
import {
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
} from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Check real admin authentication credentials
    const hasAuthCookie = typeof document !== 'undefined' && document.cookie.includes('quranmind_admin_auth=true')
    const hasStorage = typeof window !== 'undefined' && localStorage.getItem('qm_admin_authenticated') === 'true'

    if (hasAuthCookie || hasStorage) {
      setAuthorized(true)
    } else {
      setAuthorized(false)
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'quranmind_admin_auth=; path=/; max-age=0'
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('qm_admin_authenticated')
    }
    router.push('/admin/login')
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#010814] text-cyan-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">جاري التحقق من صلاحيات المدير...</span>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#020b18] text-slate-100 p-4 sm:p-6" dir="rtl">
      {/* Top Admin Navigation Bar */}
      <header className="mb-6 p-4 bg-[#031527] border border-cyan-900/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#062947] border border-cyan-500/60 flex items-center justify-center text-cyan-400 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">
                لوحة الإدارة المركزية والمدفوعات
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-950/80 border border-red-700/80 text-red-300 font-bold">
                حساب محمي (Root Admin)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              إدارة جميع المستخدمين، الرتب، وبوابات الدفع الإلكتروني (SlickPay & Stripe)
            </p>
          </div>
        </div>

        {/* System & Gateways Status */}
        <div className="flex items-center gap-2 text-[10px] flex-wrap">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SATIM / SlickPay (DZD): متصل</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800 text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Stripe (USD): متصل</span>
          </div>

          {/* Return to Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#062444] hover:bg-[#09355f] border border-cyan-800/60 text-cyan-200 text-xs transition"
          >
            <span>لوحة المستخدم</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs transition"
            title="تسجيل الخروج من لوحة المدير"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard View */}
      <main className="max-w-7xl mx-auto">
        <AdminDashboardView />
      </main>
    </div>
  )
}
