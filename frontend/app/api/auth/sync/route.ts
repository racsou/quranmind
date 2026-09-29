import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    let clerkUser = null
    try {
      clerkUser = await currentUser()
    } catch (e) {
      // Clerk not configured or not signed in
    }

    if (!clerkUser) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: 'لا يوجد جلسة مستخدم مسجلة حالياً عبر Clerk',
      })
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress
    if (!email) {
      return NextResponse.json({
        success: false,
        authenticated: true,
        error: 'لم يتم العثور على بريد إلكتروني في حساب Clerk',
      })
    }

    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
      clerkUser.username ||
      'باحث قرآني'

    const hasPassword = Boolean(clerkUser.passwordEnabled)
    const provider = clerkUser.externalAccounts?.length
      ? clerkUser.externalAccounts[0].provider
      : hasPassword
      ? 'password'
      : 'clerk'

    // Check desired role from body or metadata if sent
    let desiredRole = 'student'
    try {
      const body = await req.json()
      if (body?.role && ['student', 'scholar', 'patron'].includes(body.role)) {
        desiredRole = body.role
      }
    } catch {}

    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()

      // Check if user already exists in Supabase
      const { data: existingUser, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${clerkUser.id},email.eq.${email}`)
        .maybeSingle()

      if (existingUser) {
        // Update user fields
        const { data: updated, error: updateErr } = await supabase
          .from('users')
          .update({
            name: fullName || existingUser.name,
            has_password: hasPassword,
            auth_provider: provider,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single()

        return NextResponse.json({
          success: true,
          authenticated: true,
          action: 'updated',
          user: updated || existingUser,
        })
      } else {
        // Insert new user into Supabase
        const newUser = {
          id: clerkUser.id,
          name: fullName,
          email: email,
          role: desiredRole,
          status: 'active',
          plan: 'free',
          gateway: 'stripe',
          currency: 'USD',
          amount_paid: 0,
          api_requests: 0,
          projects_count: 0,
          has_password: hasPassword,
          auth_provider: provider,
          storage_used_mb: 25,
          quota_limit: 5000,
          joined_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        const { data: created, error: insertErr } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single()

        if (insertErr) {
          console.error('Supabase user insert error:', insertErr)
          return NextResponse.json({
            success: true,
            authenticated: true,
            fallbackUser: newUser,
            warning: insertErr.message,
          })
        }

        return NextResponse.json({
          success: true,
          authenticated: true,
          action: 'created',
          user: created,
        })
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: clerkUser.id,
        name: fullName,
        email: email,
        role: desiredRole,
        plan: 'free',
        has_password: hasPassword,
        auth_provider: provider,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
