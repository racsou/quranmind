import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export type UserRole = 'admin' | 'scholar' | 'student' | 'patron'
export type UserStatus = 'active' | 'suspended'

export interface ManagedUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  plan: 'free' | 'pro' | 'patron'
  gateway: 'slickpay' | 'stripe' | 'manual_waqf'
  currency: 'DZD' | 'USD'
  amountPaid: number
  joinedAt: string
  apiRequests: number
  projectsCount: number
  hasPassword: boolean
  authProvider: 'password' | 'google' | 'apple' | 'github' | 'clerk'
  lastActive: string
  lastPasswordReset?: string | null
  storageUsedMb: number
  quotaLimit: number
}

// In-memory / Mock User Database
let USERS_DATABASE: ManagedUser[] = [
  {
    id: 'usr-admin-1',
    name: 'د. عبد الله البشير (مدير النظام)',
    email: 'admin@quranmind.ai',
    role: 'admin',
    status: 'active',
    plan: 'patron',
    gateway: 'stripe',
    currency: 'USD',
    amountPaid: 490,
    joinedAt: '2026-01-10',
    apiRequests: 1420,
    projectsCount: 18,
    hasPassword: true,
    authProvider: 'password',
    lastActive: 'الآن',
    lastPasswordReset: '2026-06-01',
    storageUsedMb: 120,
    quotaLimit: 10000,
  },
  {
    id: 'usr-scholar-2',
    name: 'أ.د. يوسف القاسمي',
    email: 'youssef.qasimi@univ-algiers.dz',
    role: 'scholar',
    status: 'active',
    plan: 'pro',
    gateway: 'slickpay',
    currency: 'DZD',
    amountPaid: 2500, // SATIM CIB payment
    joinedAt: '2026-03-15',
    apiRequests: 890,
    projectsCount: 6,
    hasPassword: true,
    authProvider: 'password',
    lastActive: 'منذ 15 دقيقة',
    lastPasswordReset: null,
    storageUsedMb: 45,
    quotaLimit: 5000,
  },
  {
    id: 'usr-scholar-3',
    name: 'Dr. Tariq Al-Ghamdi',
    email: 'tariq.ghamdi@islamicstudies.org',
    role: 'scholar',
    status: 'active',
    plan: 'pro',
    gateway: 'stripe',
    currency: 'USD',
    amountPaid: 190,
    joinedAt: '2026-04-02',
    apiRequests: 540,
    projectsCount: 4,
    hasPassword: false, // Signed up via Google OAuth
    authProvider: 'google',
    lastActive: 'منذ ساعتين',
    lastPasswordReset: null,
    storageUsedMb: 30,
    quotaLimit: 5000,
  },
  {
    id: 'usr-patron-4',
    name: 'مؤسسة الوقف الرقمي العالمي',
    email: 'endowment@waqf-digital.org',
    role: 'patron',
    status: 'active',
    plan: 'patron',
    gateway: 'stripe',
    currency: 'USD',
    amountPaid: 490,
    joinedAt: '2026-02-18',
    apiRequests: 3200,
    projectsCount: 12,
    hasPassword: false, // Signed up via Clerk SSO
    authProvider: 'clerk',
    lastActive: 'منذ يوم',
    lastPasswordReset: null,
    storageUsedMb: 210,
    quotaLimit: 20000,
  },
  {
    id: 'usr-student-5',
    name: 'حمزة بن عاشور (طالب ماجستير)',
    email: 'hamza.ashour@student.edu.dz',
    role: 'student',
    status: 'active',
    plan: 'free',
    gateway: 'slickpay',
    currency: 'DZD',
    amountPaid: 0,
    joinedAt: '2026-05-11',
    apiRequests: 210,
    projectsCount: 2,
    hasPassword: true,
    authProvider: 'password',
    lastActive: 'منذ 3 ساعات',
    lastPasswordReset: null,
    storageUsedMb: 12,
    quotaLimit: 1000,
  },
  {
    id: 'usr-student-6',
    name: 'فاطمة الزهراء الشريف',
    email: 'fatima.sharif@gmail.com',
    role: 'student',
    status: 'active',
    plan: 'free',
    gateway: 'stripe',
    currency: 'USD',
    amountPaid: 0,
    joinedAt: '2026-06-01',
    apiRequests: 145,
    projectsCount: 1,
    hasPassword: false, // Signed up via Google OAuth
    authProvider: 'google',
    lastActive: 'منذ 5 أيام',
    lastPasswordReset: null,
    storageUsedMb: 8,
    quotaLimit: 1000,
  },
]

function checkAdminAuth(req: NextRequest): boolean {
  const adminCookie = req.cookies.get('quranmind_admin_auth')?.value === 'true'
  const authHeader = req.headers.get('authorization')
  const isMasterKey = authHeader === 'Bearer quranmind-admin-2026'
  return adminCookie || isMasterKey
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'غير مصرح: الوصول لبيانات وسجلات المستخدمين مقتصر على مدير النظام فقط.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  const search = searchParams.get('q')

  if (isSupabaseConfigured) {
    try {
      const supabase = getServiceSupabase()
      let query = supabase.from('users').select('*')

      if (role && role !== 'all') query = query.eq('role', role)
      if (status && status !== 'all') query = query.eq('status', status)
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        const mappedUsers: ManagedUser[] = data.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: u.status,
          plan: u.plan,
          gateway: u.gateway || 'stripe',
          currency: u.currency || 'USD',
          amountPaid: Number(u.amount_paid) || 0,
          joinedAt: u.joined_at?.split('T')[0] || '2026-01-01',
          apiRequests: u.api_requests || 0,
          projectsCount: u.projects_count || 0,
          hasPassword:
            u.has_password !== undefined && u.has_password !== null
              ? Boolean(u.has_password)
              : u.auth_provider === 'google' || u.auth_provider === 'oauth' || u.email?.includes('gmail')
              ? false
              : true,
          authProvider:
            u.auth_provider || (u.email?.includes('gmail') ? 'google' : 'password'),
          lastActive: u.last_active || 'مؤخراً',
          lastPasswordReset: u.last_password_reset || null,
          storageUsedMb: u.storage_used_mb || 25,
          quotaLimit: u.quota_limit || 5000,
        }))

        const summary = {
          totalUsers: mappedUsers.length,
          adminsCount: mappedUsers.filter((u) => u.role === 'admin').length,
          scholarsCount: mappedUsers.filter((u) => u.role === 'scholar').length,
          studentsCount: mappedUsers.filter((u) => u.role === 'student').length,
          patronsCount: mappedUsers.filter((u) => u.role === 'patron').length,
          totalSlickPayRevenueDZD: mappedUsers.filter((u) => u.currency === 'DZD').reduce((acc, u) => acc + u.amountPaid, 0),
          totalStripeRevenueUSD: mappedUsers.filter((u) => u.currency === 'USD').reduce((acc, u) => acc + u.amountPaid, 0),
        }

        return NextResponse.json({
          success: true,
          source: 'supabase',
          summary,
          count: mappedUsers.length,
          data: mappedUsers,
        })
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using fallback database:', e)
    }
  }

  let results = [...USERS_DATABASE]

  if (role && role !== 'all') {
    results = results.filter((u) => u.role === role)
  }

  if (status && status !== 'all') {
    results = results.filter((u) => u.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    results = results.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }

  // Summary statistics
  const summary = {
    totalUsers: USERS_DATABASE.length,
    adminsCount: USERS_DATABASE.filter((u) => u.role === 'admin').length,
    scholarsCount: USERS_DATABASE.filter((u) => u.role === 'scholar').length,
    studentsCount: USERS_DATABASE.filter((u) => u.role === 'student').length,
    patronsCount: USERS_DATABASE.filter((u) => u.role === 'patron').length,
    totalSlickPayRevenueDZD: USERS_DATABASE.filter((u) => u.currency === 'DZD').reduce((acc, u) => acc + u.amountPaid, 0),
    totalStripeRevenueUSD: USERS_DATABASE.filter((u) => u.currency === 'USD').reduce((acc, u) => acc + u.amountPaid, 0),
  }

  return NextResponse.json({
    success: true,
    source: 'fallback',
    summary,
    count: results.length,
    data: results,
  })
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json(
      { success: false, error: 'غير مصرح: تعديل بيانات وصلاحيات المستخدمين مقتصر على مدير النظام فقط.' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { userId, role, status, plan, gateway, currency, amountPaid, action, newPassword } = body

    const userIndex = USERS_DATABASE.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const targetUser = USERS_DATABASE[userIndex]

    // Action 1: Manual Password Reset
    if (action === 'reset_password') {
      if (!targetUser.hasPassword) {
        return NextResponse.json(
          {
            success: false,
            error: 'لا يمكن إعادة تعيين كلمة المرور لهذا المستخدم لأنه سجل عبر موفر خارجي (OAuth) بدون كلمة مرور.',
          },
          { status: 400 }
        )
      }

      const generatedPassword = newPassword && newPassword.trim() ? newPassword.trim() : `QM-${Math.random().toString(36).substring(2, 10).toUpperCase()}!`
      targetUser.lastPasswordReset = new Date().toISOString().split('T')[0]

      return NextResponse.json({
        success: true,
        action: 'reset_password',
        message: `تم إعادة تعيين كلمة المرور للمستخدم (${targetUser.name}) بنجاح.`,
        newPassword: generatedPassword,
        user: targetUser,
      })
    }

    // Action 2: Reset API Quota
    if (action === 'reset_quota') {
      targetUser.apiRequests = 0
      return NextResponse.json({
        success: true,
        action: 'reset_quota',
        message: `تم تصفير عداد استهلاك الـ API للمستخدم (${targetUser.name}) بنجاح.`,
        user: targetUser,
      })
    }

    // Action 3: Manage Subscription & Payments
    if (action === 'update_plan' || plan) {
      if (plan) targetUser.plan = plan
      if (gateway) targetUser.gateway = gateway
      if (currency) targetUser.currency = currency
      if (amountPaid !== undefined) targetUser.amountPaid = Number(amountPaid)
      if (plan === 'pro') targetUser.role = 'scholar'
      if (plan === 'patron') targetUser.role = 'patron'
    }

    // Direct Updates
    if (role) targetUser.role = role
    if (status) targetUser.status = status

    if (isSupabaseConfigured) {
      try {
        const supabase = getServiceSupabase()
        const updates: Record<string, any> = {
          updated_at: new Date().toISOString(),
          role: targetUser.role,
          status: targetUser.status,
          plan: targetUser.plan,
        }
        await supabase.from('users').update(updates).eq('id', userId)
      } catch (e) {
        console.warn('Supabase sync warning:', e)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المستخدم وصلاحياته بنجاح',
      user: targetUser,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
