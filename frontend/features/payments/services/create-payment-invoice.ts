import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { createSlickPayInvoice } from '@/lib/payments/slickpay'
import { createStripeCheckoutSession } from '@/lib/payments/stripe'
import { getPlanAmount, getPlanTitle, PlanTier, CurrencyCode } from '@/config/plans'
import { PaymentGatewayId } from '@/config/gateways'

export interface CreateInvoiceParams {
  plan?: PlanTier
  gateway?: PaymentGatewayId
  currency?: CurrencyCode
  email: string
  userId?: string
  name?: string
  host?: string
}

export interface CreateInvoiceResult {
  paymentId: string
  invoiceSerial: string
  paymentUrl: string
  gateway: PaymentGatewayId
  currency: CurrencyCode
  amount: number
  plan: PlanTier
  planTitle: string
}

export async function createPaymentInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
  const { plan = 'pro', gateway = 'slickpay', email, userId, name, host = 'localhost:3000' } = params
  const effectiveCurrency: CurrencyCode = params.currency || (gateway === 'slickpay' ? 'DZD' : 'USD')
  const amount = getPlanAmount(plan, effectiveCurrency)
  const planTitle = getPlanTitle(plan)

  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  let invoiceSerial = `PAY-${Date.now().toString().slice(-6)}QM`
  let paymentUrl = ''
  let sessionId = ''

  const protocol = host.includes('localhost') ? 'http' : 'https'

  if (gateway === 'slickpay') {
    const returnUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=success&id=${paymentId}`
    const invoiceResult = await createSlickPayInvoice({
      amount,
      items: [{ name: planTitle, price: amount, quantity: 1 }],
      url: returnUrl,
      email,
      firstname: name?.split(' ')?.[0] || 'باحث',
      lastname: name?.split(' ')?.[1] || 'قرآني',
      fees: 0,
    })
    invoiceSerial = invoiceResult.invoice?.serial || `PAY-SLK-${Date.now().toString().slice(-6)}`
    paymentUrl = invoiceResult.url
  } else {
    const successUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=success&id=${paymentId}`
    const cancelUrl = `${protocol}://${host}/dashboard/settings?subtab=billing&payment=cancelled`
    const stripePlanId: 'pro' | 'patron' | 'waqf_custom' = plan === 'patron' ? 'patron' : 'pro'
    const session = await createStripeCheckoutSession({
      planId: stripePlanId,
      interval: 'monthly',
      amount,
      userEmail: email,
      successUrl,
      cancelUrl,
    })
    sessionId = session.sessionId
    paymentUrl = session.checkoutUrl
    invoiceSerial = sessionId
  }

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase()
    let finalUserId = userId
    if (!finalUserId) {
      const { data: userRec } = await supabase.from('users').select('id').eq('email', email).maybeSingle()
      if (userRec) finalUserId = userRec.id
    }

    await supabase.from('payments').insert({
      id: paymentId,
      user_id: finalUserId || null,
      user_email: email,
      amount,
      currency: effectiveCurrency,
      gateway,
      plan,
      status: 'pending',
      invoice_serial: invoiceSerial,
      payment_method: gateway === 'slickpay' ? 'satim_cib' : 'card',
      metadata: { planTitle, sessionId, name: name || '' },
      created_at: new Date().toISOString(),
    })
  }

  return { paymentId, invoiceSerial, paymentUrl, gateway, currency: effectiveCurrency, amount, plan, planTitle }
}
