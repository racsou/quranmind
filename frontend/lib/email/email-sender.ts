/**
 * QuranMind Email Delivery Service (Frontend Client)
 * Delegates actual email delivery to the Express Backend Nodemailer Service
 * (http://localhost:5000/api/email/send-verification).
 */

export interface SendVerificationEmailParams {
  toEmail: string
  userName: string
  code: string
  verifyUrl?: string
}

export interface EmailDeliveryResponse {
  success: boolean
  messageId?: string
  simulated?: boolean
  error?: string
}

export async function sendVerificationEmail({
  toEmail,
  userName,
  code,
  verifyUrl,
}: SendVerificationEmailParams): Promise<EmailDeliveryResponse> {
  const effectiveVerifyUrl =
    verifyUrl || `http://localhost:3000/verify-email?email=${encodeURIComponent(toEmail)}&code=${code}`

  // 1. Delegate to Backend Nodemailer Service (port 5000)
  const backendBase =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    'http://localhost:5000/api'

  try {
    const backendRes = await fetch(`${backendBase}/email/send-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: toEmail,
        name: userName,
        code: code,
        verifyUrl: effectiveVerifyUrl,
      }),
    })

    if (backendRes.ok) {
      const data = await backendRes.json()
      if (data.success) {
        return {
          success: true,
          messageId: data.messageId,
          simulated: data.simulated,
        }
      }
    }
  } catch (err) {
    // Backend may be restarting or unreachable
  }

  // 2. Direct Resend API if key is present
  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'QuranMind <no-reply@quranmind.ai>',
          to: [toEmail],
          subject: `${code} هو رمز تأكيد بريدك الإلكتروني في منصة QuranMind`,
          html: generateEmailHtml(userName, code, effectiveVerifyUrl),
        }),
      })

      if (res.ok) {
        const json = await res.json()
        return { success: true, messageId: json.id, simulated: false }
      }
    } catch (e) {
      console.warn('Resend email API delivery failed:', e)
    }
  }

  // 3. Fallback: Log to Server Console (Clear development/simulated notice)
  console.info(`
================================================================================
📧 [QuranMind Email Sender - Simulated OTP Dispatch]
--------------------------------------------------------------------------------
To:        ${userName} <${toEmail}>
Subject:   ${code} هو رمز تأكيد بريدك الإلكتروني في منصة QuranMind
PIN Code:  👉 [ ${code} ] 👈
Link:      ${effectiveVerifyUrl}
Expires:   خلال 15 دقيقة
Notice:    ⚠️ لم يتم إرسال بريد حقيقي عبر الإنترنت لأن إعدادات SMTP غير مكتملة في backend/.env
           لتفعيل الإرسال الفعلي إلى بريدك، أضف SMTP_USER و SMTP_PASS في backend/.env
Status:    Simulated (رمز الاختبار: ${code})
================================================================================
  `)

  return {
    success: true,
    messageId: `simulated-${Date.now()}`,
    simulated: true,
  }
}

function generateEmailHtml(userName: string, code: string, verifyUrl: string): string {
  return `
  <!DOCTYPE html>
  <html dir="rtl" lang="ar">
  <head>
    <meta charset="utf-8">
    <title>تأكيد حسابك في QuranMind</title>
  </head>
  <body style="font-family: 'Cairo', Tahoma, sans-serif; background-color: #020b18; color: #e2e8f0; padding: 24px;">
    <div style="max-width: 520px; margin: 0 auto; background: #031527; border: 1px solid #164e63; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Quran<span style="color: #22d3ee;">Mind</span></h1>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">المنصة البحثية القرآنية الرقمية</p>
      </div>
      <p style="font-size: 14px; line-height: 1.6;">أهلاً بك <strong>${userName}</strong>،</p>
      <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
        شكراً لتسجيلك في منصة QuranMind. لاستكمال تفعيل حسابك، يرجى إدخال رمز التحقق التالي:
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; background: #042f4e; border: 2px dashed #06b6d4; color: #22d3ee; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 28px; border-radius: 12px; font-family: monospace;">
          ${code}
        </span>
      </div>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(to right, #0891b2, #2563eb); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 13px;">
          تأكيد البريد الإلكتروني مباشرة ←
        </a>
      </div>
      <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
        تنتهي صلاحية هذا الرمز خلال 15 دقيقة. إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذه الرسالة.
      </p>
    </div>
  </body>
  </html>
  `
}
