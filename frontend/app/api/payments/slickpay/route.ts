import { NextRequest, NextResponse } from 'next/server'
import { createSlickPayInvoice, calculateSlickPayCommission } from '@/lib/payments/slickpay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, planTitle = 'اشتراك المحقق الأكاديمي', email, returnUrl } = body

    if (!amount || amount < 100) {
      return NextResponse.json(
        { success: false, error: 'المبلغ غير صالح، الحد الأدنى للدفع عبر SATIM هو 100 دج' },
        { status: 400 }
      )
    }

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const defaultReturnUrl = `${protocol}://${host}/dashboard?payment=success&gateway=slickpay`

    const invoiceResult = await createSlickPayInvoice({
      amount: Number(amount),
      items: [
        {
          name: planTitle,
          price: Number(amount),
          quantity: 1,
        },
      ],
      url: returnUrl || defaultReturnUrl,
      email: email || 'scholar@quranmind.ai',
      fees: 100, // Client pays SATIM fee
    })

    return NextResponse.json({
      success: true,
      data: {
        invoiceId: invoiceResult.id,
        paymentUrl: invoiceResult.url, // SATIM payment URL
        serial: invoiceResult.invoice.serial,
        amount: invoiceResult.invoice.amount,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'فشل إنشاء فاتورة SlickPay' },
      { status: 500 }
    )
  }
}
