import { currentUser } from '@clerk/nextjs/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { validateRealEmail } from '@/lib/email/email-validator'

export interface SyncUserResult {
  authenticated: boolean
  emailConfirmed?: boolean
  email?: string
  redirect?: string
  message?: string
  user?: unknown
  setCookies?: { confirmed?: boolean; unverifiedEmail?: string }
}

export async function syncClerkUser(desiredRole = 'student'): Promise<SyncUserResult> {
  let clerkUser = null
  try {
    clerkUser = await currentUser()
  } catch {
    // Clerk not configured or not signed in
  }

  if (!clerkUser) {
    return { authenticated: false, message: 'لا يوجد جلسة مستخدم مسجلة حالياً عبر Clerk' }
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress
  if (!email) {
    throw new Error('لم يتم العثور على بريد إلكتروني في حساب Clerk')
  }

  const emailValidation = await validateRealEmail(email)
  if (!emailValidation.isValid) {
    throw new Error(emailValidation.error || 'البريد الإلكتروني المسجل غير صالح أو غير حقيقي.')
  }

  const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() || clerkUser.username || 'باحث قرآني'
  const hasPassword = Boolean(clerkUser.passwordEnabled)
  const provider = clerkUser.externalAccounts?.length ? clerkUser.externalAccounts[0].provider : hasPassword ? 'password' : 'clerk'

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase()
    const { data: existingUser } = await supabase.from('users').select('*').or(`id.eq.${clerkUser.id},email.eq.${email}`).maybeSingle()
    const isClerkVerified = clerkUser.emailAddresses?.[0]?.verification?.status === 'verified' || provider.startsWith('oauth_') || provider === 'google'

    let activeUser = existingUser
    if (existingUser) {
      const shouldConfirmEmail = existingUser.email_confirmed || isClerkVerified
      const { data: updated } = await supabase
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
      const initialCode = Math.floor(100000 + Math.random() * 900000).toString()
      const newUser = {
        id: clerkUser.id,
        name: fullName,
        email,
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
      const { data: created } = await supabase.from('users').insert(newUser).select().single()
      activeUser = created || (newUser as any)
    }

    const isEmailConfirmed = Boolean(activeUser?.email_confirmed)
    if (!isEmailConfirmed) {
      const pinCode = activeUser?.confirmation_code || Math.floor(100000 + Math.random() * 900000).toString()
      try {
        const { sendVerificationEmail } = await import('@/lib/email/email-sender')
        await sendVerificationEmail({ toEmail: email, userName: fullName, code: pinCode })
      } catch (mailErr) {
        console.warn('Failed to send verification email:', mailErr)
      }
      return {
        authenticated: true,
        emailConfirmed: false,
        email,
        redirect: `/verify-email?email=${encodeURIComponent(email)}`,
        message: 'الحساب قيد الانتظار: يرجى تأكيد بريدك الإلكتروني برمز التحقق (PIN).',
        user: activeUser,
        setCookies: { confirmed: false, unverifiedEmail: email },
      }
    }

    return {
      authenticated: true,
      emailConfirmed: true,
      user: activeUser,
      setCookies: { confirmed: true },
    }
  }

  return {
    authenticated: true,
    emailConfirmed: true,
    user: { id: clerkUser.id, name: fullName, email, role: desiredRole, plan: 'free', has_password: hasPassword, auth_provider: provider },
  }
}
