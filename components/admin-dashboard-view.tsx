'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  ShieldCheck,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  BookOpen,
  ArrowLeft,
  FileText,
  Sliders,
  AlertTriangle,
} from 'lucide-react'
import type { ManagedUser, UserRole, UserStatus } from '@/app/api/admin/users/route'
import type { PaymentTransaction } from '@/app/api/admin/payments/route'

export function AdminDashboardView() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'payments' | 'gateways'>('users')

  // Users Filters
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Payment Filters
  const [gatewayFilter, setGatewayFilter] = useState<string>('all')

  // SlickPay Test Invoice Form State
  const [slickPayAmount, setSlickPayAmount] = useState('2500')
  const [slickPayPlan, setSlickPayPlan] = useState('اشتراك المحقق الأكاديمي')
  const [slickPayLoading, setSlickPayLoading] = useState(false)
  const [slickPayResult, setSlickPayResult] = useState<any>(null)

  // Stripe Test Form State
  const [stripePlan, setStripePlan] = useState<'pro' | 'patron'>('pro')
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeResult, setStripeResult] = useState<any>(null)

  // Fetch Users & Transactions
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [uRes, pRes] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/admin/payments').then((r) => r.json()),
      ])
      if (uRes.success) setUsers(uRes.data)
      if (pRes.success) setTransactions(pRes.data)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update user role or status
  async function handleUpdateUser(userId: string, updates: Partial<ManagedUser>) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)))
      }
    } catch (err) {
      console.error('Failed to update user:', err)
    }
  }

  // Test SlickPay invoice generation
  async function handleTestSlickPay() {
    setSlickPayLoading(true)
    setSlickPayResult(null)
    try {
      const res = await fetch('/api/payments/slickpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(slickPayAmount),
          planTitle: slickPayPlan,
          email: 'scholar@quranmind.ai',
        }),
      })
      const data = await res.json()
      setSlickPayResult(data)
    } catch (err: any) {
      setSlickPayResult({ success: false, error: err.message })
    } finally {
      setSlickPayLoading(false)
    }
  }

  // Test Stripe session generation
  async function handleTestStripe() {
    setStripeLoading(true)
    setStripeResult(null)
    try {
      const res = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: stripePlan,
          interval: 'monthly',
          email: 'scholar@quranmind.ai',
        }),
      })
      const data = await res.json()
      setStripeResult(data)
    } catch (err: any) {
      setStripeResult({ success: false, error: err.message })
    } finally {
      setStripeLoading(false)
    }
  }

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    if (gatewayFilter !== 'all' && t.gateway !== gatewayFilter) return false
    return true
  })

  // Calculations
  const totalDZD = transactions.filter((t) => t.currency === 'DZD').reduce((acc, t) => acc + t.amount, 0)
  const totalUSD = transactions.filter((t) => t.currency === 'USD').reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold border border-cyan-700/50 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>لوحة تحكم مدير النظام (Super Admin Portal)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-serif">
            إدارة المستخدمين والمشتركين والمدفوعات (SlickPay & Stripe)
          </h1>
          <p className="text-xs text-slate-400">
            إدارة كاملة لحسابات الباحثين، تراخيص الوقف، ومتابعة بوابات الدفع الوطنية (SATIM) والدولية
          </p>
        </div>

        <button
          onClick={fetchData}
          className="self-start sm:self-auto px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs rounded-xl flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-[#031527] border border-slate-800 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>إجمالي المستخدمين</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span>{users.filter((u) => u.role === 'scholar').length} محقق</span>
            <span>·</span>
            <span>{users.filter((u) => u.role === 'patron').length} راعي وقف</span>
          </div>
        </div>

        <div className="p-4 bg-[#031527] border border-cyan-800/60 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>مدفوعات SlickPay (DZD)</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {totalDZD.toLocaleString()} <span className="text-xs font-normal">دج</span>
          </div>
          <div className="text-[10px] text-slate-400">
            بطاقات CIB والذهبية (SATIM الجزائر)
          </div>
        </div>

        <div className="p-4 bg-[#031527] border border-emerald-800/60 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>مدفوعات Stripe (USD)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            ${totalUSD.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            اشتراكات ورعاية دولية مستمرة
          </div>
        </div>

        <div className="p-4 bg-[#031527] border border-amber-800/60 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>استعلامات الـ API المعتمدة</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {users.reduce((acc, u) => acc + (u.apiRequests || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            استدعاءات موثقة عبر /v1/*
          </div>
        </div>

      </div>

      {/* Tab Switcher inside Admin Dashboard */}
      <div className="flex gap-2 p-1.5 bg-[#031527] border border-slate-800 rounded-xl text-xs">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'users' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة المستخدمين والصلاحيات ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'payments' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>سجل المعاملات والفواتير ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gateways')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
            activeSubTab === 'gateways' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>تهيئة بوابات الدفع (SlickPay & Stripe)</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* 1. USERS MANAGEMENT TAB                                                 */}
      {/* ======================================================================= */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="p-3 bg-[#031527] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">النوع:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="admin">مدير النظام (Admin)</option>
                  <option value="scholar">محقق أكاديمي (Scholar)</option>
                  <option value="student">طالب علم (Student)</option>
                  <option value="patron">راعي وقف (Patron)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">الحالة:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط (Active)</option>
                  <option value="suspended">معلق (Suspended)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#031527] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#020b18] border-b border-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-3.5">المستخدم</th>
                    <th className="p-3.5">نوع المستخدم (Role)</th>
                    <th className="p-3.5">الخطة</th>
                    <th className="p-3.5">بوابة الدفع</th>
                    <th className="p-3.5">المدفوع</th>
                    <th className="p-3.5">طلبات API</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUser(user.id, { role: e.target.value as UserRole })}
                          className={`text-xs px-2 py-1 rounded-lg border font-semibold outline-none ${
                            user.role === 'admin'
                              ? 'bg-purple-950 border-purple-700 text-purple-300'
                              : user.role === 'scholar'
                              ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                              : user.role === 'patron'
                              ? 'bg-amber-950 border-amber-700 text-amber-300'
                              : 'bg-slate-900 border-slate-700 text-slate-300'
                          }`}
                        >
                          <option value="admin">مدير (Admin)</option>
                          <option value="scholar">محقق (Scholar)</option>
                          <option value="student">طالب (Student)</option>
                          <option value="patron">راعي وقف (Patron)</option>
                        </select>
                      </td>

                      <td className="p-3.5">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {user.plan === 'pro' ? 'المحقق (Pro)' : user.plan === 'patron' ? 'وقف (Patron)' : 'مجاني (Free)'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          {user.gateway === 'slickpay' ? (
                            <span className="text-cyan-400 font-semibold">SlickPay (SATIM)</span>
                          ) : user.gateway === 'stripe' ? (
                            <span className="text-emerald-400 font-semibold">Stripe (USD)</span>
                          ) : (
                            <span className="text-slate-400">وقف مباشر</span>
                          )}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono">
                        {user.amountPaid > 0 ? (
                          <span className="text-emerald-400 font-bold">
                            {user.amountPaid} {user.currency}
                          </span>
                        ) : (
                          <span className="text-slate-500">$0</span>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-cyan-300">
                        {user.apiRequests || 0}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          }`}
                        >
                          {user.status === 'active' ? 'نشط' : 'معلق'}
                        </span>
                      </td>

                      <td className="p-3.5 text-left space-x-1 space-x-reverse">
                        <button
                          onClick={() =>
                            handleUpdateUser(user.id, {
                              status: user.status === 'active' ? 'suspended' : 'active',
                            })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                            user.status === 'active'
                              ? 'bg-rose-950 hover:bg-rose-900 border-rose-700 text-rose-200'
                              : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-200'
                          }`}
                        >
                          {user.status === 'active' ? 'تعليق الحساب' : 'تفعيل الحساب'}
                        </button>

                        <button
                          onClick={() => handleUpdateUser(user.id, { plan: 'pro', role: 'scholar' })}
                          className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-[10px]"
                          title="منح ترخيص باحث وقفي مجاناً"
                        >
                          منحة بحثية
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. TRANSACTIONS & INVOICES TAB                                          */}
      {/* ======================================================================= */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          
          <div className="p-3 bg-[#031527] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">تصفية حسب بوابة الدفع:</span>
              <button
                onClick={() => setGatewayFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  gatewayFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setGatewayFilter('slickpay')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  gatewayFilter === 'slickpay' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                SlickPay (CIB / EDAHABIA)
              </button>
              <button
                onClick={() => setGatewayFilter('stripe')}
                className={`px-3 py-1 rounded-lg font-bold ${
                  gatewayFilter === 'stripe' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Stripe (بطاقات دولية)
              </button>
            </div>

            <div className="text-xs text-slate-400">
              إجمالي المعاملات: <strong className="text-white">{filteredTransactions.length}</strong>
            </div>
          </div>

          <div className="border border-slate-800 rounded-2xl overflow-hidden bg-[#031527] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#020b18] border-b border-slate-800 text-slate-400 font-semibold">
                  <tr>
                    <th className="p-3.5">الرقم المرجعي / الفاتورة</th>
                    <th className="p-3.5">بوابة الدفع</th>
                    <th className="p-3.5">المستخدم</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">الخطة</th>
                    <th className="p-3.5">التاريخ والوقت</th>
                    <th className="p-3.5">حالة السداد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/50 transition font-mono">
                      <td className="p-3.5">
                        <span className="text-cyan-300 font-bold block">{tx.serial}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{tx.id}</span>
                      </td>

                      <td className="p-3.5 font-sans">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            tx.gateway === 'slickpay'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {tx.gateway === 'slickpay' ? 'SlickPay (SATIM)' : 'Stripe'}
                        </span>
                      </td>

                      <td className="p-3.5 font-sans">
                        <div className="text-white font-semibold">{tx.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.userEmail}</div>
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400 text-sm">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>

                      <td className="p-3.5 font-sans text-slate-300">
                        {tx.plan === 'patron' ? 'وقف سنوي' : 'محقق أكاديمي'}
                      </td>

                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {tx.date}
                      </td>

                      <td className="p-3.5 font-sans">
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> تم الدفع بنجاح
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. PAYMENT GATEWAYS CONFIGURATION & SANDBOX CONSOLE                     */}
      {/* ======================================================================= */}
      {activeSubTab === 'gateways' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SlickPay Gateway Console */}
          <div className="p-6 rounded-2xl bg-[#031527] border border-cyan-800/60 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">بوابة SlickPay (SATIM CIB / EDAHABIA)</h3>
                  <span className="text-[10px] text-cyan-400">بطاقات الدفع الإلكتروني الوطنية بالدينار الجزائري</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                متصل بالبيئة التجريبية (Sandbox)
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">نقطة النهاية (Base URL):</span>
                <span className="font-mono text-cyan-300">https://devapi.slick-pay.com/api/v2</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">نسبة تحمل الرسوم (Fees split):</span>
                <span className="font-mono text-emerald-300">100% (العميل يتحمل عمولة SATIM)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">طريقة التحويل:</span>
                <span className="text-white">SATIM EPG (Hosted Payment Page)</span>
              </div>
            </div>

            {/* Test Form */}
            <div className="p-4 bg-[#020b18] rounded-xl border border-slate-800 space-y-3 text-xs">
              <strong className="text-cyan-300 block font-bold">تجربة إنشاء فاتورة تجريبية (Test Invoice):</strong>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">المبلغ (DZD):</label>
                  <input
                    type="number"
                    value={slickPayAmount}
                    onChange={(e) => setSlickPayAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">الخطة:</label>
                  <input
                    type="text"
                    value={slickPayPlan}
                    onChange={(e) => setSlickPayPlan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleTestSlickPay}
                disabled={slickPayLoading}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                {slickPayLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                إنشاء فاتورة SlickPay والحصول على رابط SATIM
              </button>

              {slickPayResult && (
                <div className="p-3 bg-slate-900 rounded-lg border border-cyan-800 text-[11px] space-y-1.5">
                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>✓ تم إنشاء الفاتورة بنجاح: #{slickPayResult.data?.invoiceId}</span>
                    <span>{slickPayResult.data?.amount}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">رقم السريال: {slickPayResult.data?.serial}</div>
                  <a
                    href={slickPayResult.data?.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 font-bold hover:underline pt-1"
                  >
                    فتح صفحة دفع SATIM التجريبية <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Stripe Gateway Console */}
          <div className="p-6 rounded-2xl bg-[#031527] border border-emerald-800/60 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">بوابة Stripe (International Cards & Waqf)</h3>
                  <span className="text-[10px] text-emerald-400">الاشتراكات الدولية والوقف بالدولار واليورو</span>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                Stripe Checkout Ready
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">العملة الافتراضية:</span>
                <span className="font-mono text-emerald-300">USD / EUR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">الدفع التلقائي الدوري:</span>
                <span className="text-white">شهري وسنوي (Subscription Mode)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">البطاقات المقبولة:</span>
                <span className="text-white">Visa, Mastercard, Apple Pay, Google Pay</span>
              </div>
            </div>

            {/* Test Form */}
            <div className="p-4 bg-[#020b18] rounded-xl border border-slate-800 space-y-3 text-xs">
              <strong className="text-emerald-300 block font-bold">تجربة جلسة Stripe Checkout:</strong>

              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={stripePlan === 'pro'}
                    onChange={() => setStripePlan('pro')}
                    className="accent-cyan-500"
                  />
                  <span>المحقق ($19/شهرياً)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={stripePlan === 'patron'}
                    onChange={() => setStripePlan('patron')}
                    className="accent-cyan-500"
                  />
                  <span>راعي الوقف ($49/شهرياً)</span>
                </label>
              </div>

              <button
                onClick={handleTestStripe}
                disabled={stripeLoading}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
              >
                {stripeLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <DollarSign className="w-3.5 h-3.5" />}
                إنشاء جلسة Stripe Checkout
              </button>

              {stripeResult && (
                <div className="p-3 bg-slate-900 rounded-lg border border-emerald-800 text-[11px] space-y-1.5">
                  <div className="text-emerald-400 font-bold">
                    ✓ تم إنشاء الجلسة: {stripeResult.data?.sessionId}
                  </div>
                  <a
                    href={stripeResult.data?.checkoutUrl}
                    className="inline-flex items-center gap-1 text-cyan-400 font-bold hover:underline"
                  >
                    الانتقال لصفحة دفع Stripe Checkout <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
