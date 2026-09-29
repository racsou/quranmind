import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch {}

    const clerkEmail = clerkUser?.emailAddresses?.[0]?.emailAddress
    const clerkId = clerkUser?.id

    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()

      let targetUser = null

      if (clerkEmail || clerkId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .or(`id.eq.${clerkId || ''},email.eq.${clerkEmail || ''}`)
          .maybeSingle()

        if (data) targetUser = data
      }

      // If not authenticated via Clerk, check query or fallback to active user in Supabase
      if (!targetUser) {
        const emailQuery = req.nextUrl.searchParams.get('email')
        if (emailQuery) {
          const { data } = await supabase.from('users').select('*').eq('email', emailQuery).maybeSingle()
          if (data) targetUser = data
        }
      }

      // Default fallback from real Supabase table
      if (!targetUser) {
        const { data: defaultList } = await supabase
          .from('users')
          .select('*')
          .limit(1)
          .order('created_at', { ascending: false })

        if (defaultList && defaultList.length > 0) {
          targetUser = defaultList[0]
        }
      }

      if (targetUser) {
        return NextResponse.json({
          success: true,
          source: 'supabase',
          user: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
            status: targetUser.status,
            plan: targetUser.plan,
            gateway: targetUser.gateway || 'stripe',
            currency: targetUser.currency || 'USD',
            amountPaid: Number(targetUser.amount_paid) || 0,
            apiRequests: targetUser.api_requests || 0,
            projectsCount: targetUser.projects_count || 0,
            joinedAt: targetUser.joined_at?.split('T')[0] || '2026-01-01',
            hasPassword: targetUser.has_password ?? true,
            authProvider: targetUser.auth_provider || 'password',
            storageUsedMb: targetUser.storage_used_mb || 25,
            quotaLimit: targetUser.quota_limit || 5000,
          },
        })
      }
    }

    // Fallback if DB not reachable
    return NextResponse.json({
      success: true,
      source: 'local-fallback',
      user: {
        id: clerkId || 'usr-scholar-2',
        name: clerkUser ? [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') : 'أ.د. يوسف القاسمي',
        email: clerkEmail || 'youssef.qasimi@univ-algiers.dz',
        role: 'scholar',
        status: 'active',
        plan: 'pro',
        gateway: 'slickpay',
        currency: 'DZD',
        amountPaid: 2500,
        apiRequests: 890,
        projectsCount: 6,
        joinedAt: '2026-03-15',
        hasPassword: true,
        authProvider: 'password',
        storageUsedMb: 45,
        quotaLimit: 5000,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, email, name, plan, gateway, currency, amountPaid } = body

    if (!id && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or Email is required' },
        { status: 400 }
      )
    }

    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()
      const updateData: any = { updated_at: new Date().toISOString() }

      if (name) updateData.name = name
      if (plan) updateData.plan = plan
      if (gateway) updateData.gateway = gateway
      if (currency) updateData.currency = currency
      if (amountPaid !== undefined) updateData.amount_paid = amountPaid

      let query = supabase.from('users').update(updateData)
      if (id) {
        query = query.eq('id', id)
      } else {
        query = query.eq('email', email)
      }

      const { data, error } = await query.select().single()

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        action: 'updated',
        user: data,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Simulated update (Supabase not configured)',
      user: body,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
