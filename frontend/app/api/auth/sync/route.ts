import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { validateRealEmail } from '@/lib/email/email-validator'

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

    // Validate real email existence
    const emailValidation = await validateRealEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          authenticated: true,
          error: emailValidation.error || 'البريد الإلكتروني المسجل غير صالح أو غير حقيقي.',
        },
        { status: 400 }
      )
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

      const isClerkVerified =
        clerkUser.emailAddresses?.[0]?.verification?.status === 'verified' ||
        provider.startsWith('oauth_') ||
        provider === 'google'

      let activeUser = existingUser

      if (existingUser) {
        // Update user fields
        const shouldConfirmEmail = existingUser.email_confirmed || isClerkVerified
        const { data: updated, error: updateErr } = await supabase
          .from('users')
          .update({
            name: fullName || existingUser.name,
            has_password: hasPassword,
            auth_provider: provider,
            email_confirmed: shouldConfirmEmail,
            confirmation_code: shouldConfirmEmail ? null : existingUser.confirmation_code,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUser.id)
          .select()
          .single()

        activeUser = updated || existingUser
      } else {
        // Generate initial confirmation code for new user
        const initialCode = Math.floor(100000 + Math.random() * 900000).toString()

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
          email_confirmed: isClerkVerified,
          confirmation_code: isClerkVerified ? null : initialCode,
          confirmation_sent_at: new Date().toISOString(),
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
          activeUser = newUser as any
        } else {
          activeUser = created
        }
      }

      const isEmailConfirmed = Boolean(activeUser?.email_confirmed)

      // If email is not confirmed, dispatch 6-digit PIN and enforce redirect
      if (!isEmailConfirmed) {
        const pinCode = activeUser?.confirmation_code || Math.floor(100000 + Math.random() * 900000).toString()
        try {
          const { sendVerificationEmail } = await import('@/lib/email/email-sender')
          await sendVerificationEmail({
            toEmail: email,
            userName: fullName,
            code: pinCode,
          })
        } catch (mailErr) {
          console.warn('Failed to send verification email:', mailErr)
        }

        const res = NextResponse.json({
          success: true,
          authenticated: true,
          emailConfirmed: false,
          email: email,
          redirect: `/verify-email?email=${encodeURIComponent(email)}`,
          message: 'الحساب قيد الانتظار: يرجى تأكيد بريدك الإلكتروني برمز التحقق (PIN).',
          user: activeUser,
        })

        // Invalidate confirmed cookie and set unverified email cookie
        res.cookies.delete('qm_email_confirmed')
        res.cookies.set('qm_unverified_email', email, {
          path: '/',
          maxAge: 86400,
          sameSite: 'lax',
        })
        return res
      }

      // Email is confirmed
      const res = NextResponse.json({
        success: true,
        authenticated: true,
        emailConfirmed: true,
        action: existingUser ? 'updated' : 'created',
        user: activeUser,
      })

      res.cookies.set('qm_email_confirmed', 'true', {
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
        sameSite: 'lax',
      })
      res.cookies.delete('qm_unverified_email')
      return res
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      emailConfirmed: true,
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
