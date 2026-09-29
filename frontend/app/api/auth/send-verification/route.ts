import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { sendVerificationEmail } from '@/lib/email/email-sender'
import { validateRealEmail } from '@/lib/email/email-validator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    // Real Email Validator: Syntax, disposable domains, and DNS MX record verification
    const validation = await validateRealEmail(email)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error || 'البريد الإلكتروني غير صالح أو غير حقيقي.' },
        { status: 400 }
      )
    }

    const cleanEmail = validation.normalizedEmail!

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const now = new Date().toISOString()

    let userName = cleanEmail.split('@')[0]

    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()

      // Fetch or create user record
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (user) {
        userName = user.name || userName
        await supabase
          .from('users')
          .update({
            confirmation_code: code,
            confirmation_sent_at: now,
          })
          .eq('id', user.id)
      } else {
        // Create user with unconfirmed status
        await supabase.from('users').insert({
          id: `usr-${Date.now()}`,
          name: userName,
          email: cleanEmail,
          role: 'student',
          status: 'active',
          plan: 'free',
          email_confirmed: false,
          confirmation_code: code,
          confirmation_sent_at: now,
        })
      }
    }

    // Send email using backend email sender
    const delivery = await sendVerificationEmail({
      toEmail: cleanEmail,
      userName: userName,
      code: code,
    })

    return NextResponse.json({
      success: true,
      message: delivery.simulated
        ? `تم توليد رمز التحقق لـ ${cleanEmail} (وضع التطوير/المحاكاة - لم يتم ضبط SMTP بعد)`
        : `تم إرسال رمز التحقق المكون من 6 أرقام إلى ${cleanEmail}`,
      simulated: delivery.simulated,
      code: process.env.NODE_ENV === 'development' || delivery.simulated ? code : undefined,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
