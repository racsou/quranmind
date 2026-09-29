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
  KeyRound,
  Lock,
  Copy,
  Check,
  Activity,
  Eye,
  X,
  Sparkles,
  Clock,
  Database,
  FolderKanban,
  Receipt,
  UserCheck,
  CheckCheck,
  Play,
  Save,
} from 'lucide-react'
import type { ManagedUser, UserRole, UserStatus } from '@/app/api/admin/users/route'
import type { PaymentTransaction } from '@/app/api/admin/payments/route'

export function AdminDashboardView() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'payments' | 'gateways' | 'monitoring'>('users')

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

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

  // --- MODALS STATE ---
  // 1. Password Reset Modal
  const [resetPasswordUser, setResetPasswordUser] = useState<ManagedUser | null>(null)
  const [customNewPassword, setCustomNewPassword] = useState('')
  const [passwordResetSuccess, setPasswordResetSuccess] = useState<string | null>(null)
  const [passwordResetLoading, setPasswordResetLoading] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  // 2. Manage Payment / Subscription Modal
  const [managePaymentUser, setManagePaymentUser] = useState<ManagedUser | null>(null)
  const [editPlan, setEditPlan] = useState<'free' | 'pro' | 'patron'>('pro')
  const [editGateway, setEditGateway] = useState<'slickpay' | 'stripe' | 'manual_waqf'>('slickpay')
  const [editCurrency, setEditCurrency] = useState<'DZD' | 'USD'>('DZD')
  const [editAmountPaid, setEditAmountPaid] = useState<number>(2500)
  const [paymentUpdateLoading, setPaymentUpdateLoading] = useState(false)

  // 3. User Monitor Inspection Modal
  const [monitoredUser, setMonitoredUser] = useState<ManagedUser | null>(null)

  // Fetch Users & Transactions
  useEffect(() => {
    fetchData()
  }, [])

  function showToast(text: string, type: 'success' | 'error' = 'success') {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

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
      showToast('تعذر تحميل بيانات الإدارة', 'error')
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
        showToast(data.message || 'تم تحديث بيانات المستخدم بنجاح')
      } else {
        showToast(data.error || 'فشل التحديث', 'error')
      }
    } catch (err) {
      console.error('Failed to update user:', err)
      showToast('خطأ في الاتصال بالخادم', 'error')
    }
  }

  // Manual Password Reset Execution
  async function handleExecutePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    if (!resetPasswordUser) return
    setPasswordResetLoading(true)
    setPasswordResetSuccess(null)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: resetPasswordUser.id,
          action: 'reset_password',
          newPassword: customNewPassword.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPasswordResetSuccess(data.newPassword)
        setUsers((prev) =>
          prev.map((u) =>
            u.id === resetPasswordUser.id
              ? { ...u, lastPasswordReset: new Date().toISOString().split('T')[0] }
              : u
          )
        )
        showToast(`تم تعيين كلمة المرور الجديدة لـ (${resetPasswordUser.name})`)
      } else {
        showToast(data.error || 'تعذر إعادة تعيين كلمة المرور', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'خطأ في الشبكة', 'error')
    } finally {
      setPasswordResetLoading(false)
    }
  }

  // Reset API Quota for a user
  async function handleResetQuota(userId: string) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'reset_quota' }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, apiRequests: 0 } : u)))
        showToast(data.message || 'تم تصفير استهلاك الـ API بنجاح')
        if (monitoredUser && monitoredUser.id === userId) {
          setMonitoredUser({ ...monitoredUser, apiRequests: 0 })
        }
      }
    } catch (err) {
      showToast('خطأ في تصفير العداد', 'error')
    }
  }

  // Save Subscription & Payment Updates
  async function handleSavePaymentUpdates(e: React.FormEvent) {
    e.preventDefault()
    if (!managePaymentUser) return
    setPaymentUpdateLoading(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: managePaymentUser.id,
          action: 'update_plan',
          plan: editPlan,
          gateway: editGateway,
          currency: editCurrency,
          amountPaid: editAmountPaid,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === managePaymentUser.id
              ? {
                  ...u,
                  plan: editPlan,
                  gateway: editGateway,
                  currency: editCurrency,
                  amountPaid: editAmountPaid,
                  role: editPlan === 'pro' ? 'scholar' : editPlan === 'patron' ? 'patron' : u.role,
                }
              : u
          )
        )

        // Add transaction entry
        if (editAmountPaid > 0) {
          const newTx: PaymentTransaction = {
            id: `tx-admin-${Date.now()}`,
            serial: `ADMIN-GRANT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            gateway: editGateway === 'slickpay' ? 'slickpay' : 'stripe',
            method: editGateway === 'slickpay' ? 'satim_cib' : 'visa_mastercard',
            userEmail: managePaymentUser.email,
            userName: managePaymentUser.name,
            amount: editAmountPaid,
            currency: editCurrency,
            status: 'completed',
            plan: editPlan,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          }
          setTransactions((prev) => [newTx, ...prev])
        }

        showToast(`تم تحديث خطة واشتراك (${managePaymentUser.name}) بنجاح`)
        setManagePaymentUser(null)
      } else {
        showToast(data.error || 'تعذر تحديث الاشتراك', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'خطأ في الشبكة', 'error')
    } finally {
      setPaymentUpdateLoading(false)
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
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 left-5 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2 text-xs font-bold transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
              : 'bg-rose-950 border-rose-700 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Overview Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold border border-cyan-700/50 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>لوحة تحكم مدير النظام (Super Admin Portal)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            مراقبة المستخدمين، إدارة كلمات المرور، والاشتراكات
          </h1>
          <p className="text-xs text-slate-400">
            إدارة كاملة لحسابات الباحثين، إعادة تعيين كلمات المرور، ومتابعة بوابات الدفع الوطنية (SATIM) والدولية (Stripe).
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
        <div className="p-4 bg-[#031527] border border-slate-800 rounded-2xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>المستخدمون المسجلون</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{users.length}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span>{users.filter((u) => u.role === 'scholar').length} محقق</span>
            <span>·</span>
            <span>{users.filter((u) => u.hasPassword).length} بكلمة مرور</span>
          </div>
        </div>

        <div className="p-4 bg-[#031527] border border-cyan-800/60 rounded-2xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span>مدفوعات SlickPay (DZD)</span>
            <CreditCard className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {totalDZD.toLocaleString()} <span className="text-xs font-normal">دج</span>
          </div>
          <div className="text-[10px] text-slate-400">بطاقات CIB والذهبية (SATIM)</div>
        </div>

        <div className="p-4 bg-[#031527] border border-emerald-800/60 rounded-2xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>مدفوعات Stripe (USD)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            ${totalUSD.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">اشتراكات ورعاية دولية</div>
        </div>

        <div className="p-4 bg-[#031527] border border-amber-800/60 rounded-2xl space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span>استهلاك الـ API المعتمد</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {users.reduce((acc, u) => acc + (u.apiRequests || 0), 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">مجموع استدعاءات الباحثين</div>
        </div>
      </div>

      {/* Tab Switcher inside Admin Dashboard */}
      <div className="flex gap-2 p-1.5 bg-[#031527] border border-slate-800 rounded-xl text-xs overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'users' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمون وكلمات المرور ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('monitoring')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'monitoring' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>نظام المراقبة والاستهلاك (Live Monitor)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'payments' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>سجل المدفوعات والاشتراكات ({transactions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gateways')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeSubTab === 'gateways' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>تهيئة بوابات الدفع</span>
        </button>
      </div>

      {/* ======================================================================= */}
      {/* 1. USERS & CREDENTIALS MANAGEMENT TAB                                   */}
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

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">الرتبة:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                >
                  <option value="all">الكل</option>
                  <option value="admin">مدير (Admin)</option>
                  <option value="scholar">محقق (Scholar)</option>
                  <option value="student">طالب (Student)</option>
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
                  <option value="all">الكل</option>
                  <option value="active">نشط</option>
                  <option value="suspended">معلق</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#031527] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#020e1d] text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">المستخدم</th>
                    <th className="p-3.5">الرتبة</th>
                    <th className="p-3.5">الاشتراك</th>
                    <th className="p-3.5">طريقة الدخول</th>
                    <th className="p-3.5">إدارة كلمة المرور</th>
                    <th className="p-3.5">إدارة الاشتراك</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5 text-left">إجراءات الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 border border-red-800 font-bold">
                              Root
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{user.email}</div>
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
                        <span
                          className={`capitalize px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            user.plan === 'patron'
                              ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                              : user.plan === 'pro'
                              ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {user.plan === 'pro' ? 'المحقق (Pro)' : user.plan === 'patron' ? 'وقف (Patron)' : 'مجاني (Free)'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800">
                          {user.authProvider === 'password'
                            ? 'بريد + كلمة مرور'
                            : user.authProvider === 'google'
                            ? 'Google OAuth'
                            : user.authProvider === 'clerk'
                            ? 'Clerk SSO'
                            : 'حساب خارجي'}
                        </span>
                      </td>

                      {/* PASSWORD MANAGEMENT COLUMN */}
                      <td className="p-3.5">
                        {user.hasPassword ? (
                          <button
                            onClick={() => {
                              setResetPasswordUser(user)
                              setCustomNewPassword('')
                              setPasswordResetSuccess(null)
                            }}
                            className="px-2.5 py-1 bg-amber-950/70 hover:bg-amber-900 border border-amber-700 text-amber-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>إعادة تعيين كلمة المرور</span>
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold cursor-not-allowed">
                            <Lock className="w-3 h-3 text-slate-500" />
                            <span>بدون كلمة مرور (OAuth)</span>
                          </div>
                        )}
                      </td>

                      {/* PAYMENT & SUBSCRIPTION MANAGEMENT COLUMN */}
                      <td className="p-3.5">
                        <button
                          onClick={() => {
                            setManagePaymentUser(user)
                            setEditPlan(user.plan)
                            setEditGateway(user.gateway)
                            setEditCurrency(user.currency)
                            setEditAmountPaid(user.amountPaid)
                          }}
                          className="px-2.5 py-1 bg-[#062444] hover:bg-[#09355e] border border-cyan-800 text-cyan-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                          <span>إدارة الاشتراك ({user.amountPaid} {user.currency})</span>
                        </button>
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
                          onClick={() => setMonitoredUser(user)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] transition"
                          title="عرض مقاييس استهلاك النظام"
                        >
                          مراقبة
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateUser(user.id, {
                              status: user.status === 'active' ? 'suspended' : 'active',
                            })
                          }
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition ${
                            user.status === 'active'
                              ? 'bg-rose-950 hover:bg-rose-900 border-rose-700 text-rose-200'
                              : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-200'
                          }`}
                        >
                          {user.status === 'active' ? 'تعليق' : 'تفعيل'}
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
      {/* 2. USER MONITORING & SYSTEM CONSUMPTION TAB                             */}
      {/* ======================================================================= */}
      {activeSubTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#031527] border border-cyan-900/40 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                مراقبة استهلاك الموارد والحصص اللحظية للباحثين
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                متابعة استدعاءات الـ API، مساحات التخزين للملفات والتقارير، والمشاريع المنشأة لكل حساب.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const quotaPercent = Math.min(Math.round((user.apiRequests / (user.quotaLimit || 5000)) * 100), 100)
              return (
                <div
                  key={user.id}
                  className="p-5 bg-[#031527] border border-slate-800 rounded-2xl space-y-4 shadow-lg hover:border-cyan-800 transition"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{user.name}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {user.status === 'active' ? 'نشط' : 'معلق'}
                    </span>
                  </div>

                  {/* Quota Progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">استهلاك استدعاءات الـ API</span>
                      <span className="text-cyan-300 font-bold">
                        {user.apiRequests.toLocaleString()} / {(user.quotaLimit || 5000).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all duration-500 ${
                          quotaPercent > 85 ? 'bg-rose-500' : quotaPercent > 60 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${quotaPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-[#020e1d] border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">المشاريع</span>
                      <strong className="text-white font-mono">{user.projectsCount}</strong>
                    </div>
                    <div className="p-2 bg-[#020e1d] border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">التخزين</span>
                      <strong className="text-white font-mono">{user.storageUsedMb} MB</strong>
                    </div>
                    <div className="p-2 bg-[#020e1d] border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-400 block">آخر نشاط</span>
                      <span className="text-emerald-400 text-[10px] font-semibold">{user.lastActive}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleResetQuota(user.id)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>تصفير العداد</span>
                    </button>
                    <button
                      onClick={() => setMonitoredUser(user)}
                      className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded-lg text-xs font-semibold"
                    >
                      التفاصيل
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. TRANSACTIONS & INVOICES TAB                                          */}
      {/* ======================================================================= */}
      {activeSubTab === 'payments' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#031527] border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">تصفية حسب البوابة:</span>
              <select
                value={gatewayFilter}
                onChange={(e) => setGatewayFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
              >
                <option value="all">جميع البوابات</option>
                <option value="slickpay">SlickPay (SATIM الجزائر)</option>
                <option value="stripe">Stripe (دولي)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#031527] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#020e1d] text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">الرقم التسلسلي / المعرف</th>
                    <th className="p-3.5">الباحث</th>
                    <th className="p-3.5">البوابة والطريقة</th>
                    <th className="p-3.5">المبلغ</th>
                    <th className="p-3.5">الخطة</th>
                    <th className="p-3.5">الحالة</th>
                    <th className="p-3.5">التاريخ والوقت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5 font-mono text-cyan-300 font-semibold">{tx.serial}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{tx.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{tx.userEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-300">
                          {tx.gateway === 'slickpay' ? 'SlickPay (SATIM)' : 'Stripe Global'}
                        </span>
                        <span className="block text-[10px] text-slate-500 uppercase">{tx.method}</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-400">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                          {tx.plan}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          مكتمل وموثق
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400 text-[11px]">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. GATEWAYS TESTING TAB                                                 */}
      {/* ======================================================================= */}
      {activeSubTab === 'gateways' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SlickPay Gateway */}
          <div className="p-5 bg-[#031527] border border-cyan-900/40 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">بوابة SlickPay (بطاقات الذهبية و CIB)</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
                SATIM جاهز
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تتيح للباحثين والمؤسسات في الجزائر سداد الاشتراكات بالدينار الجزائري مباشرة عبر بطاقات بنوك SATIM وبريد الجزائر.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قيمة الفاتورة التجريبية (دج)</label>
                <input
                  type="number"
                  value={slickPayAmount}
                  onChange={(e) => setSlickPayAmount(e.target.value)}
                  className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
              <button
                onClick={handleTestSlickPay}
                disabled={slickPayLoading}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {slickPayLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>إنشاء فاتورة اختبارية بـ SlickPay</span>
              </button>
            </div>
            {slickPayResult && (
              <div className="p-3 bg-[#010a17] border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                <pre>{JSON.stringify(slickPayResult, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Stripe Gateway */}
          <div className="p-5 bg-[#031527] border border-cyan-900/40 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">بوابة Stripe (البطاقات الدولية)</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                Stripe USD
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              معالجة الاشتراكات الدولية والتبرعات الوقفية بالدولار عبر بطاقات Visa و MasterCard و Apple Pay.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اختر الباقة الدولية</label>
                <select
                  value={stripePlan}
                  onChange={(e) => setStripePlan(e.target.value as any)}
                  className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value="pro">باقة المحقق (Pro - $19/mo)</option>
                  <option value="patron">باقة راعي الوقف (Patron - $49/mo)</option>
                </select>
              </div>
              <button
                onClick={handleTestStripe}
                disabled={stripeLoading}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {stripeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>بدء جلسة اختبارية بـ Stripe Checkout</span>
              </button>
            </div>
            {stripeResult && (
              <div className="p-3 bg-[#010a17] border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
                <pre>{JSON.stringify(stripeResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 1: MANUAL PASSWORD RESET                                          */}
      {/* ======================================================================= */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#031527] border border-cyan-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setResetPasswordUser(null)
                setPasswordResetSuccess(null)
              }}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">إعادة تعيين كلمة المرور يدوياً</h3>
                <p className="text-xs text-slate-400">{resetPasswordUser.name} ({resetPasswordUser.email})</p>
              </div>
            </div>

            {passwordResetSuccess ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>تم تعيين كلمة المرور الجديدة بنجاح!</span>
                </div>
                <div className="p-3 bg-[#010b17] border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs text-white">
                  <span>{passwordResetSuccess}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(passwordResetSuccess)
                      setCopiedPassword(true)
                      setTimeout(() => setCopiedPassword(false), 2000)
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPassword ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  يرجى تسليم كلمة المرور للمستخدم أو إرسالها عبر بريده المسجل.
                </p>
                <button
                  onClick={() => {
                    setResetPasswordUser(null)
                    setPasswordResetSuccess(null)
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecutePasswordReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    أدخل كلمة مرور جديدة (أو اتركها فارغة لتوليد كلمة عشوائية آمنة)
                  </label>
                  <input
                    type="text"
                    value={customNewPassword}
                    onChange={(e) => setCustomNewPassword(e.target.value)}
                    placeholder="مثال: QuranScholar2026!#"
                    className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const randomPass = `QM-${Math.random().toString(36).substring(2, 9).toUpperCase()}!#`
                      setCustomNewPassword(randomPass)
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>توليد تلقائي</span>
                  </button>

                  <button
                    type="submit"
                    disabled={passwordResetLoading}
                    className="flex-1 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {passwordResetLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    <span>تأكيد وحفظ كلمة المرور</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: MANAGE SUBSCRIPTION & PAYMENTS                                 */}
      {/* ======================================================================= */}
      {managePaymentUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#031527] border border-cyan-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setManagePaymentUser(null)} className="absolute top-4 left-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">إدارة الاشتراك والمدفوعات</h3>
                <p className="text-xs text-slate-400">{managePaymentUser.name} ({managePaymentUser.email})</p>
              </div>
            </div>

            <form onSubmit={handleSavePaymentUpdates} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">الخطة والترخيص الأكاديمي</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value as any)}
                  className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                >
                  <option value="free">مجاني (Free - طالب علم)</option>
                  <option value="pro">المحقق الأكاديمي (Pro Scholar - ترخيص كامل)</option>
                  <option value="patron">راعي الوقف القرآني (Patron - وصول غير محدود)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">بوابة الدفع</label>
                  <select
                    value={editGateway}
                    onChange={(e) => setEditGateway(e.target.value as any)}
                    className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="slickpay">SlickPay (SATIM)</option>
                    <option value="stripe">Stripe (USD)</option>
                    <option value="manual_waqf">وقف / منحة يدوية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">العملة</label>
                  <select
                    value={editCurrency}
                    onChange={(e) => setEditCurrency(e.target.value as any)}
                    className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400"
                  >
                    <option value="DZD">دينار جزائري (DZD)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">المبلغ المحصل / الموثق</label>
                <input
                  type="number"
                  value={editAmountPaid}
                  onChange={(e) => setEditAmountPaid(Number(e.target.value))}
                  className="w-full bg-[#051c36] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManagePaymentUser(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={paymentUpdateLoading}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold shadow-md transition flex items-center justify-center gap-1.5"
                >
                  {paymentUpdateLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: USER MONITORING INSPECTION MODAL                               */}
      {/* ======================================================================= */}
      {monitoredUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#031527] border border-cyan-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setMonitoredUser(null)} className="absolute top-4 left-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">الملف الرقابي للمستخدم</h3>
                <p className="text-xs text-slate-400">{monitoredUser.name} ({monitoredUser.email})</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">طريقة المصادقة</span>
                <div className="font-bold text-white">{monitoredUser.authProvider}</div>
              </div>
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">حالة كلمة المرور</span>
                <div className="font-bold text-white">
                  {monitoredUser.hasPassword ? 'مسجلة ومفعلة' : 'بدون كلمة مرور (OAuth)'}
                </div>
              </div>
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">استهلاك الـ API</span>
                <div className="font-bold text-cyan-300 font-mono">
                  {monitoredUser.apiRequests} / {monitoredUser.quotaLimit || 5000}
                </div>
              </div>
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">المشاريع المفتوحة</span>
                <div className="font-bold text-white font-mono">{monitoredUser.projectsCount} مشروع</div>
              </div>
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">تاريخ الانضمام</span>
                <div className="font-mono text-slate-300">{monitoredUser.joinedAt}</div>
              </div>
              <div className="p-3 bg-[#010e1d] border border-slate-800 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400">آخر إعادة تعيين كلمة سر</span>
                <div className="font-mono text-amber-300">
                  {monitoredUser.lastPasswordReset || 'لم يتم تغييرها'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                onClick={() => handleResetQuota(monitoredUser.id)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تصفير عداد الـ API</span>
              </button>
              <button
                onClick={() => setMonitoredUser(null)}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
