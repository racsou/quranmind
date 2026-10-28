import { NextRequest } from 'next/server'
import { respond } from '@/shared/api/respond'
import { parseBody } from '@/shared/api/parse-body'
import { createPaymentInvoice, CreateInvoiceParams } from '@/features/payments/services/create-payment-invoice'

export async function POST(req: NextRequest) {
  const parsed = await parseBody<CreateInvoiceParams>(req)
  if (!parsed.success) {
    return respond.fail(parsed.error, 400)
  }

  const { email } = parsed.data
  if (!email) {
    return respond.fail('البريد الإلكتروني مطلوب لإنشاء فاتورة الاشتراك', 400)
  }

  try {
    const host = req.headers.get('host') || 'localhost:3000'
    const result = await createPaymentInvoice({ ...parsed.data, host })
    return respond.ok(result)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'فشل إنشاء طلب الدفع'
    return respond.fail(msg, 500)
  }
}
