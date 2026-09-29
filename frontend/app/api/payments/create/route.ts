import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { createSlickPayInvoice } from '@/lib/payments/slickpay'
import { createStripeCheckoutSession } from '@/lib/payments/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      plan = 'pro',
      gateway = 'slickpay',
      currency: requestedCurrency,
      email,
      userId,
      name,
    } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب لإنشاء فاتورة الاشتراك' },
        { status: 400 }
      )
    }

    const effectiveCurrency = requestedCurrency || (gateway === 'slickpay' ? 'DZD' : 'USD')
    let amount = 2500
    let planTitle = 'اشتراك باقة المحقق الأكاديمي (Pro Scholar)'

    if (plan === 'patron') {
      planTitle = 'اشتراك باقة الوقف والراعي الرقمي (Patron)'
      amount = effectiveCurrency === 'DZD' ? 5000 : 49
    } else {
      amount = effectiveCurrency === 'DZD' ? 2500 : 19
    }

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    let invoiceSerial = `PAY-${Date.now().toString().slice(-6)}QM`
    let paymentUrl = ''
    let sessionId = ''

    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'

    if (gateway === 'slickpay') {
      const returnUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=success&id=${paymentId}`
      const invoiceResult = await createSlickPayInvoice({
        amount: amount,
        items: [
          {
            name: planTitle,
            price: amount,
            quantity: 1,
          },
        ],
        url: returnUrl,
        email: email,
        firstname: name?.split(' ')?.[0] || 'باحث',
        lastname: name?.split(' ')?.[1] || 'قرآني',
        fees: 0, // QuranMind covers commission
      })

      invoiceSerial = invoiceResult.invoice?.serial || `PAY-SLK-${Date.now().toString().slice(-6)}`
      paymentUrl = invoiceResult.url
    } else {
      // Stripe
      const successUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=success&id=${paymentId}`
      const cancelUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=cancelled`

      const session = await createStripeCheckoutSession({
        planId: plan,
        interval: 'monthly',
        amount: amount,
        userEmail: email,
        successUrl,
        cancelUrl,
      })

      sessionId = session.sessionId
      paymentUrl = session.checkoutUrl
      invoiceSerial = sessionId
    }

    // Persist payment order in Supabase
    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()

      // Resolve userId if not provided
      let finalUserId = userId
      if (!finalUserId) {
        const { data: userRec } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle()
        if (userRec) finalUserId = userRec.id
      }

      await supabase.from('payments').insert({
        id: paymentId,
        user_id: finalUserId || null,
        user_email: email,
        amount: amount,
        currency: effectiveCurrency,
        gateway: gateway,
        plan: plan,
        status: 'pending',
        invoice_serial: invoiceSerial,
        payment_method: gateway === 'slickpay' ? 'satim_cib' : 'card',
        metadata: {
          planTitle,
          sessionId,
          name: name || '',
        },
        created_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentId,
        invoiceSerial,
        paymentUrl,
        gateway,
        currency: effectiveCurrency,
        amount,
        plan,
        planTitle,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'فشل إنشاء طلب الدفع' },
      { status: 500 }
    )
  }
}
