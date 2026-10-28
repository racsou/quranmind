import { NextRequest } from 'next/server'
import { respond } from '@/shared/api/respond'
import { parseBody } from '@/shared/api/parse-body'
import { sendVerificationCode } from '@/features/auth/services/send-verification-code'

export async function POST(req: NextRequest) {
  const parsed = await parseBody<{ email?: string }>(req)
  if (!parsed.success || !parsed.data?.email) {
    return respond.fail('البريد الإلكتروني مطلوب', 400)
  }

  try {
    const result = await sendVerificationCode(parsed.data.email)
    return respond.ok(result)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'فشل إرسال رمز التحقق'
    return respond.fail(msg, 500)
  }
}
