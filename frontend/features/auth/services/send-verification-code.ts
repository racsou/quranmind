import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { sendVerificationEmail } from '@/lib/email/email-sender'
import { validateRealEmail } from '@/lib/email/email-validator'

export interface SendVerificationResult {
  message: string
  simulated: boolean
  code?: string
}

export async function sendVerificationCode(rawEmail: string): Promise<SendVerificationResult> {
  const validation = await validateRealEmail(rawEmail)
  if (!validation.isValid) {
    throw new Error(validation.error || 'البريد الإلكتروني غير صالح أو غير حقيقي.')
  }

  const cleanEmail = validation.normalizedEmail!
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = new Date().toISOString()
  let userName = cleanEmail.split('@')[0]

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase()
    const { data: user } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle()

    if (user) {
      userName = user.name || userName
      await supabase.from('users').update({ confirmation_code: code, confirmation_sent_at: now }).eq('id', user.id)
    } else {
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

  const delivery = await sendVerificationEmail({ toEmail: cleanEmail, userName, code })

  return {
    message: delivery.simulated
      ? `تم توليد رمز التحقق لـ ${cleanEmail} (وضع التطوير/المحاكاة)`
      : `تم إرسال رمز التحقق المكون من 6 أرقام إلى ${cleanEmail}`,
    simulated: Boolean(delivery.simulated),
    code: process.env.NODE_ENV === 'development' || delivery.simulated ? code : undefined,
  }
}
