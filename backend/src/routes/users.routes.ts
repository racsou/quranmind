import { Router, Request, Response } from 'express'
import { getServiceSupabase } from '../db/supabase.js'
import { config } from '../config/index.js'

const router = Router()

// Default in-memory users for fallback
let FALLBACK_USERS = [
  { id: 'usr-admin-1', name: 'د. عبد الله البشير (مدير النظام)', email: 'admin@quranmind.ai', role: 'admin', status: 'active', plan: 'patron', gateway: 'stripe', currency: 'USD', amount_paid: 490, api_requests: 1420, projects_count: 18, joined_at: '2026-01-10T00:00:00Z' },
  { id: 'usr-scholar-2', name: 'أ.د. يوسف القاسمي', email: 'youssef.qasimi@univ-algiers.dz', role: 'scholar', status: 'active', plan: 'pro', gateway: 'slickpay', currency: 'DZD', amount_paid: 2500, api_requests: 890, projects_count: 6, joined_at: '2026-03-15T00:00:00Z' },
  { id: 'usr-scholar-3', name: 'Dr. Tariq Al-Ghamdi', email: 'tariq.ghamdi@islamicstudies.org', role: 'scholar', status: 'active', plan: 'pro', gateway: 'stripe', currency: 'USD', amount_paid: 190, api_requests: 540, projects_count: 4, joined_at: '2026-04-02T00:00:00Z' },
  { id: 'usr-patron-4', name: 'مؤسسة الوقف الرقمي العالمي', email: 'endowment@waqf-digital.org', role: 'patron', status: 'active', plan: 'patron', gateway: 'stripe', currency: 'USD', amount_paid: 490, api_requests: 3200, projects_count: 12, joined_at: '2026-02-18T00:00:00Z' },
  { id: 'usr-student-5', name: 'حمزة بن عاشور (طالب ماجستير)', email: 'hamza.ashour@student.edu.dz', role: 'student', status: 'active', plan: 'free', gateway: 'slickpay', currency: 'DZD', amount_paid: 0, api_requests: 210, projects_count: 2, joined_at: '2026-05-11T00:00:00Z' },
  { id: 'usr-student-6', name: 'فاطمة الزهراء الشريف', email: 'fatima.sharif@gmail.com', role: 'student', status: 'active', plan: 'free', gateway: 'stripe', currency: 'USD', amount_paid: 0, api_requests: 145, projects_count: 1, joined_at: '2026-06-01T00:00:00Z' },
]

// 1. List Users
router.get('/', async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string
    const status = req.query.status as string
    const search = ((req.query.q as string) || '').toLowerCase()

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      let query = supabase.from('users').select('*')

      if (role && role !== 'all') query = query.eq('role', role)
      if (status && status !== 'all') query = query.eq('status', status)
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        const summary = {
          totalUsers: data.length,
          adminsCount: data.filter((u) => u.role === 'admin').length,
          scholarsCount: data.filter((u) => u.role === 'scholar').length,
          studentsCount: data.filter((u) => u.role === 'student').length,
          patronsCount: data.filter((u) => u.role === 'patron').length,
          totalSlickPayRevenueDZD: data.filter((u) => u.currency === 'DZD').reduce((acc, u) => acc + (Number(u.amount_paid) || 0), 0),
          totalStripeRevenueUSD: data.filter((u) => u.currency === 'USD').reduce((acc, u) => acc + (Number(u.amount_paid) || 0), 0),
        }

        return res.json({ success: true, summary, count: data.length, data })
      }
    }

    // Fallback users
    let results = [...FALLBACK_USERS]
    if (role && role !== 'all') results = results.filter((u) => u.role === role)
    if (status && status !== 'all') results = results.filter((u) => u.status === status)
    if (search) results = results.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))

    const summary = {
      totalUsers: results.length,
      adminsCount: results.filter((u) => u.role === 'admin').length,
      scholarsCount: results.filter((u) => u.role === 'scholar').length,
      studentsCount: results.filter((u) => u.role === 'student').length,
      patronsCount: results.filter((u) => u.role === 'patron').length,
      totalSlickPayRevenueDZD: results.filter((u) => u.currency === 'DZD').reduce((acc, u) => acc + u.amount_paid, 0),
      totalStripeRevenueUSD: results.filter((u) => u.currency === 'USD').reduce((acc, u) => acc + u.amount_paid, 0),
    }

    res.json({ success: true, source: 'fallback', summary, count: results.length, data: results })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 2. Get User By ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
      if (!error && data) {
        return res.json({ success: true, data })
      }
    }

    const user = FALLBACK_USERS.find((u) => u.id === id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found' })

    res.json({ success: true, source: 'fallback', data: user })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 3. Update User (Role, Plan, Status)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role, status, plan } = req.body

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (role) updates.role = role
    if (status) updates.status = status
    if (plan) updates.plan = plan

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (!error && data) {
        return res.json({ success: true, message: 'User updated in Supabase', data })
      }
    }

    const index = FALLBACK_USERS.findIndex((u) => u.id === id)
    if (index === -1) return res.status(404).json({ success: false, error: 'User not found' })

    FALLBACK_USERS[index] = { ...FALLBACK_USERS[index], ...updates }
    res.json({ success: true, message: 'User updated in fallback store', data: FALLBACK_USERS[index] })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// 4. Create or Upsert User
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, name, email, role = 'student', plan = 'free', gateway = 'stripe', currency = 'USD' } = req.body

    if (!id || !email) {
      return res.status(400).json({ success: false, error: 'User id and email are required' })
    }

    const newUser = {
      id,
      name: name || email.split('@')[0],
      email,
      role,
      status: 'active',
      plan,
      gateway,
      currency,
      amount_paid: 0,
      api_requests: 0,
      projects_count: 0,
      joined_at: new Date().toISOString(),
    }

    if (config.isSupabaseConfigured()) {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase.from('users').upsert(newUser, { onConflict: 'id' }).select().single()
      if (!error && data) {
        return res.json({ success: true, data })
      }
    }

    FALLBACK_USERS.push(newUser as any)
    res.json({ success: true, source: 'fallback', data: newUser })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
