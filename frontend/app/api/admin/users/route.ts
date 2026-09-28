import { NextRequest, NextResponse } from 'next/server'

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
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')
  const status = searchParams.get('status')
  const search = searchParams.get('q')

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
    summary,
    count: results.length,
    data: results,
  })
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, role, status, plan } = body

    const userIndex = USERS_DATABASE.findIndex((u) => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    if (role) USERS_DATABASE[userIndex].role = role
    if (status) USERS_DATABASE[userIndex].status = status
    if (plan) USERS_DATABASE[userIndex].plan = plan

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المستخدم وصلاحياته بنجاح',
      user: USERS_DATABASE[userIndex],
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
