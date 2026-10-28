import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import { getPlanAmount, getPlanTitle, PlanTier, CurrencyCode } from '@/config/plans'
import { PaymentGatewayId } from '@/config/gateways'

export interface ConfirmPaymentParams {
  paymentId?: string
  email: string
  gateway?: PaymentGatewayId
  plan?: PlanTier
  currency?: CurrencyCode
  amount?: number
  cardNumber?: string
  cardType?: 'edahabia' | 'cib'
  invoiceSerial?: string
}

export interface PaymentInvoiceSummary {
  serial: string
  amount: string
  plan: string
  date: string
  gateway: string
  paymentMethod?: string
  status: string
}

export interface ConfirmPaymentResult {
  message: string
  invoice: PaymentInvoiceSummary
  user?: unknown
}

export async function confirmPaymentOrder(params: ConfirmPaymentParams): Promise<ConfirmPaymentResult> {
  const {
    paymentId,
    email,
    gateway = 'slickpay',
    plan = 'pro',
    currency = 'DZD',
    amount,
    cardNumber,
    cardType = 'edahabia',
    invoiceSerial,
  } = params

  const cleanEmail = email.trim().toLowerCase()
  const finalAmount = amount || getPlanAmount(plan, currency)
  const assignedRole = plan === 'patron' ? 'patron' : 'scholar'
  const now = new Date().toISOString()
  const serial = invoiceSerial || `PAY-${Date.now().toString().slice(-6)}QM`
  const last4 = cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : '4912'
  const paymentMethod = gateway === 'slickpay' ? (cardType === 'edahabia' ? 'الذهبية (Edahabia)' : 'CIB البنكية') : 'Visa/Mastercard'
  const planDisplay = getPlanTitle(plan)

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase()
    const { data: user } = await supabase.from('users').select('*').eq('email', cleanEmail).maybeSingle()
    if (!user) {
      throw new Error('لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني.')
    }

    const { data: updatedUser, error: updateErr } = await supabase
      .from('users')
      .update({ plan, role: assignedRole, gateway, currency, amount_paid: finalAmount, updated_at: now })
      .eq('id', user.id)
      .select()
      .single()

    if (updateErr) throw new Error(updateErr.message)

    if (paymentId) {
      await supabase
        .from('payments')
        .update({ status: 'completed', completed_at: now, invoice_serial: serial, payment_method: paymentMethod, amount: finalAmount, currency, plan })
        .eq('id', paymentId)
    } else {
      await supabase.from('payments').insert({
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: user.id,
        user_email: cleanEmail,
        amount: finalAmount,
        currency,
        gateway,
        plan,
        status: 'completed',
        invoice_serial: serial,
        payment_method: paymentMethod,
        completed_at: now,
        created_at: now,
      })
    }

    return {
      message: `تم إتمام عملية الدفع بنجاح! تمت ترقية حسابك إلى ${planDisplay}.`,
      user: updatedUser,
      invoice: {
        serial,
        amount: `${finalAmount} ${currency}`,
        plan: planDisplay,
        date: now.split('T')[0],
        gateway: gateway === 'slickpay' ? 'SlickPay (SATIM EPG)' : 'Stripe Payments',
        paymentMethod: `${paymentMethod} **** ${last4}`,
        status: 'مكتمل ومعتمد ✓',
      },
    }
  }

  return {
    message: 'تم إتمام عملية الدفع وتفعيل الباقة بنجاح (وضع المعاينة).',
    invoice: {
      serial,
      amount: `${finalAmount} ${currency}`,
      plan: planDisplay,
      date: now.split('T')[0],
      gateway,
      status: 'مكتمل ومعتمد ✓',
    },
  }
}
