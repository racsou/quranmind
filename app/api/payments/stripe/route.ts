import { NextRequest, NextResponse } from 'next/server'
import { createStripeCheckoutSession } from '@/lib/payments/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { planId = 'pro', interval = 'monthly', amount, email } = body

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'

    const successUrl = `${protocol}://${host}/dashboard?payment=success&gateway=stripe`
    const cancelUrl = `${protocol}://${host}/dashboard?payment=cancelled`

    const session = await createStripeCheckoutSession({
      planId,
      interval,
      amount,
      userEmail: email || 'user@quranmind.ai',
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        checkoutUrl: session.checkoutUrl,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'فشل إنشاء جلسة الدفع عبر Stripe' },
      { status: 500 }
    )
  }
}
