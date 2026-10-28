import { NextRequest } from 'next/server'
import { respond } from '@/shared/api/respond'
import { parseBody } from '@/shared/api/parse-body'
import { confirmPaymentOrder, ConfirmPaymentParams } from '@/features/payments/services/confirm-payment-order'

export async function POST(req: NextRequest) {
  const parsed = await parseBody<ConfirmPaymentParams>(req)
  if (!parsed.success) {
    return respond.fail(parsed.error, 400)
  }

  const { email } = parsed.data
  if (!email) {
    return respond.fail('البريد الإلكتروني مطلوب لتأكيد الدفع', 400)
  }

  try {
    const result = await confirmPaymentOrder(parsed.data)
    return respond.ok(result)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'فشل تأكيد عملية الدفع'
    return respond.fail(msg, 500)
  }
}
