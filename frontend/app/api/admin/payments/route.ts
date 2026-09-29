import { NextRequest, NextResponse } from 'next/server'

export interface PaymentTransaction {
  id: string
  serial: string
  gateway: 'slickpay' | 'stripe'
  method: 'satim_cib' | 'edahabia' | 'visa_mastercard'
  userEmail: string
  userName: string
  amount: number
  currency: 'DZD' | 'USD'
  status: 'completed' | 'pending' | 'failed'
  plan: 'free' | 'pro' | 'patron' | 'waqf_grant'
  date: string
}

const TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-slk-3140458',
    serial: 'PAY-0734462TNV37',
    gateway: 'slickpay',
    method: 'satim_cib',
    userEmail: 'youssef.qasimi@univ-algiers.dz',
    userName: 'أ.د. يوسف القاسمي',
    amount: 2500,
    currency: 'DZD',
    status: 'completed',
    plan: 'pro',
    date: '2026-05-21 07:34:46',
  },
  {
    id: 'tx-slk-3140459',
    serial: 'PAY-0849120KMR11',
    gateway: 'slickpay',
    method: 'edahabia',
    userEmail: 'researcher.algiers@gmail.com',
    userName: 'د. لخضر بوعلام',
    amount: 5000,
    currency: 'DZD',
    status: 'completed',
    plan: 'pro',
    date: '2026-05-22 11:15:20',
  },
  {
    id: 'tx-strp-901842',
    serial: 'ch_3Mv67xLkdIwHu7ix0Hw278',
    gateway: 'stripe',
    method: 'visa_mastercard',
    userEmail: 'tariq.ghamdi@islamicstudies.org',
    userName: 'Dr. Tariq Al-Ghamdi',
    amount: 190,
    currency: 'USD',
    status: 'completed',
    plan: 'pro',
    date: '2026-05-18 14:22:05',
  },
  {
    id: 'tx-strp-901843',
    serial: 'ch_3Mv899LkdIwHu7ix0Qy912',
    gateway: 'stripe',
    method: 'visa_mastercard',
    userEmail: 'endowment@waqf-digital.org',
    userName: 'مؤسسة الوقف الرقمي العالمي',
    amount: 490,
    currency: 'USD',
    status: 'completed',
    plan: 'patron',
    date: '2026-05-19 16:40:11',
  },
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const gateway = searchParams.get('gateway')
  const status = searchParams.get('status')

  let list = [...TRANSACTIONS]
  if (gateway && gateway !== 'all') {
    list = list.filter((t) => t.gateway === gateway)
  }
  if (status && status !== 'all') {
    list = list.filter((t) => t.status === status)
  }

  const totals = {
    totalVolumeDZD: TRANSACTIONS.filter((t) => t.currency === 'DZD' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalVolumeUSD: TRANSACTIONS.filter((t) => t.currency === 'USD' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    slickPayTransactionsCount: TRANSACTIONS.filter((t) => t.gateway === 'slickpay').length,
    stripeTransactionsCount: TRANSACTIONS.filter((t) => t.gateway === 'stripe').length,
  }

  return NextResponse.json({
    success: true,
    totals,
    count: list.length,
    data: list,
  })
}
