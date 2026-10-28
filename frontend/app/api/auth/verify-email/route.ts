import { NextRequest, NextResponse } from 'next/server'
import { respond } from '@/shared/api/respond'
import { parseBody } from '@/shared/api/parse-body'
import { verifyEmailCode } from '@/features/auth/services/verify-email-code'

export async function POST(req: NextRequest) {
  const parsed = await parseBody<{ email?: string; code?: string }>(req)
  if (!parsed.success || !parsed.data?.email || !parsed.data?.code) {
    return respond.fail('البريد الإلكتروني ورمز التحقق مطلوبان', 400)
  }

  try {
    const result = await verifyEmailCode(parsed.data.email, parsed.data.code)
    const res = NextResponse.json({ success: true, ...result })
    res.cookies.set('qm_email_confirmed', 'true', { path: '/', maxAge: 30 * 24 * 60 * 60, sameSite: 'lax' })
    res.cookies.delete('qm_unverified_email')
    return res
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'فشل تأكيد البريد الإلكتروني'
    return respond.fail(msg, 400)
  }
}
