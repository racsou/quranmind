import { NextRequest, NextResponse } from 'next/server'
import { respond } from '@/shared/api/respond'
import { parseBody } from '@/shared/api/parse-body'
import { syncClerkUser } from '@/features/auth/services/sync-clerk-user'

export async function POST(req: NextRequest) {
  try {
    const parsed = await parseBody<{ role?: string }>(req)
    const role = parsed.success && parsed.data?.role ? parsed.data.role : 'student'
    const result = await syncClerkUser(role)

    if (!result.authenticated) {
      return respond.ok({ authenticated: false, message: result.message })
    }

    const res = NextResponse.json({ success: true, ...result })

    if (result.setCookies?.confirmed) {
      res.cookies.set('qm_email_confirmed', 'true', { path: '/', maxAge: 30 * 24 * 60 * 60, sameSite: 'lax' })
      res.cookies.delete('qm_unverified_email')
    } else if (result.setCookies?.unverifiedEmail) {
      res.cookies.delete('qm_email_confirmed')
      res.cookies.set('qm_unverified_email', result.setCookies.unverifiedEmail, { path: '/', maxAge: 86400, sameSite: 'lax' })
    }

    return res
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'فشل مزامنة بيانات المستخدم'
    return respond.fail(msg, 500)
  }
}
