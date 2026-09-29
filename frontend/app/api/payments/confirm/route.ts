import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
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
    } = body

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب لتأكيد الدفع' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const finalAmount = amount || (plan === 'patron' ? (currency === 'DZD' ? 5000 : 49) : (currency === 'DZD' ? 2500 : 19))
    const assignedRole = plan === 'patron' ? 'patron' : 'scholar'
    const now = new Date().toISOString()
    const serial = invoiceSerial || `PAY-${Date.now().toString().slice(-6)}QM`
    const last4 = cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : '4912'
    const paymentMethod = gateway === 'slickpay' ? (cardType === 'edahabia' ? 'الذهبية (Edahabia)' : 'CIB البنكية') : 'Visa/Mastercard'

    if (isSupabaseConfigured) {
      const supabase = getServiceSupabase()

      // 1. Fetch user to update
      const { data: user, error: userFetchErr } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle()

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'لم يتم العثور على حساب مسجل بهذا البريد الإلكتروني.' },
          { status: 404 }
        )
      }

      // 2. Update user plan and role in Supabase
      const { data: updatedUser, error: updateErr } = await supabase
        .from('users')
        .update({
          plan: plan,
          role: assignedRole,
          gateway: gateway,
          currency: currency,
          amount_paid: finalAmount,
          updated_at: now,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateErr) {
        return NextResponse.json(
          { success: false, error: updateErr.message },
          { status: 500 }
        )
      }

      // 3. Update or Insert payment in payments table
      if (paymentId) {
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            completed_at: now,
            invoice_serial: serial,
            payment_method: paymentMethod,
            amount: finalAmount,
            currency: currency,
            plan: plan,
          })
          .eq('id', paymentId)
      } else {
        await supabase.from('payments').insert({
          id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          user_id: user.id,
          user_email: cleanEmail,
          amount: finalAmount,
          currency: currency,
          gateway: gateway,
          plan: plan,
          status: 'completed',
          invoice_serial: serial,
          payment_method: paymentMethod,
          completed_at: now,
          created_at: now,
        })
      }

      return NextResponse.json({
        success: true,
        message: `تم إتمام عملية الدفع بنجاح! تمت ترقية حسابك إلى باقة ${
          plan === 'patron' ? 'الوقف الرقمي (Patron)' : 'المحقق الأكاديمي (Pro)'
        }.`,
        user: updatedUser,
        invoice: {
          serial: serial,
          amount: `${finalAmount} ${currency}`,
          plan: plan === 'patron' ? 'باقة الوقف الرقمي (Patron)' : 'باقة المحقق الأكاديمي (Pro Scholar)',
          date: now.split('T')[0],
          gateway: gateway === 'slickpay' ? 'SlickPay (SATIM EPG)' : 'Stripe Payments',
          paymentMethod: `${paymentMethod} **** ${last4}`,
          status: 'مكتمل ومعتمد ✓',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم إتمام عملية الدفع وتفعيل الباقة بنجاح (وضع المعاينة).',
      invoice: {
        serial: serial,
        amount: `${finalAmount} ${currency}`,
        plan: plan,
        date: now.split('T')[0],
        gateway,
        status: 'مكتمل ومعتمد ✓',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'فشل تأكيد عملية الدفع' },
      { status: 500 }
    )
  }
}
