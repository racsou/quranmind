import nodemailer, { Transporter } from 'nodemailer'
import { config } from '../config/index.js'

export interface SendVerificationOptions {
  to: string
  name?: string
  code: string
  verifyUrl?: string
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  simulated: boolean
  previewUrl?: string
  error?: string
}

class EmailService {
  private transporter: Transporter | null = null
  private initialized = false

  constructor() {
    this.initTransporter()
  }

  private initTransporter(): void {
    if (config.isEmailConfigured()) {
      try {
        if (config.email.service) {
          // Preset service (e.g. 'gmail')
          this.transporter = nodemailer.createTransport({
            service: config.email.service,
            auth: {
              user: config.email.user,
              pass: config.email.pass,
            },
          })
        } else {
          // Custom SMTP
          this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure,
            auth: {
              user: config.email.user,
              pass: config.email.pass,
            },
          })
        }
        this.initialized = true
        console.log(`📧 [Nodemailer] Transporter initialized for ${config.email.user} via ${config.email.service || config.email.host}`)
      } catch (err) {
        console.error('❌ [Nodemailer] Transporter initialization error:', err)
        this.transporter = null
        this.initialized = false
      }
    } else {
      this.transporter = null
      this.initialized = false
    }
  }

  public isConfigured(): boolean {
    return this.initialized && this.transporter !== null
  }

  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false
    try {
      await this.transporter.verify()
      return true
    } catch (err) {
      console.warn('⚠️ [Nodemailer] SMTP verification failed:', err)
      return false
    }
  }

  public async sendVerificationEmail(options: SendVerificationOptions): Promise<EmailSendResult> {
    const { to, name, code, verifyUrl } = options
    const userName = name || to.split('@')[0]
    const effectiveVerifyUrl =
      verifyUrl || `http://localhost:3000/verify-email?email=${encodeURIComponent(to)}&code=${code}`

    const subject = `${code} هو رمز تأكيد بريدك الإلكتروني في منصة QuranMind`
    const html = this.buildVerificationEmailHtml(userName, code, effectiveVerifyUrl)
    const text = `أهلاً ${userName}،\nرمز تأكيد بريدك الإلكتروني في منصة QuranMind هو: [ ${code} ]\nالرابط المباشر للتأكيد: ${effectiveVerifyUrl}\nالرمز صالح لمدة 15 دقيقة.`

    // If real SMTP is configured and initialized
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: config.email.from,
          to,
          subject,
          text,
          html,
        })

        console.info(`📧 [Nodemailer] Real email successfully dispatched to ${to} (MessageId: ${info.messageId})`)

        return {
          success: true,
          messageId: info.messageId,
          simulated: false,
        }
      } catch (err: any) {
        console.error(`❌ [Nodemailer] Delivery failed to ${to}:`, err.message)
        // Fall back to simulation log below
      }
    }

    // Fallback: Simulated Delivery (Local development)
    console.info(`
================================================================================
📧 [QuranMind Backend Email Service - Nodemailer (Simulated Mode)]
--------------------------------------------------------------------------------
To:        ${userName} <${to}>
Subject:   ${subject}
PIN Code:  👉 [ ${code} ] 👈
Link:      ${effectiveVerifyUrl}
Expires:   خلال 15 دقيقة
Note:      To send REAL emails directly to Gmail inboxes:
           Add to backend/.env:
           SMTP_SERVICE=gmail
           SMTP_USER=your_email@gmail.com
           SMTP_PASS=your_16_char_google_app_password
Status:    Delivered (Simulated/Dev Mode) ✓
================================================================================
    `)

    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
      simulated: true,
    }
  }

  private buildVerificationEmailHtml(userName: string, code: string, verifyUrl: string): string {
    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>رمز تأكيد حسابك في QuranMind</title>
    </head>
    <body style="font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #01060e; color: #e2e8f0; margin: 0; padding: 32px 16px; direction: rtl;">
      <div style="max-width: 540px; margin: 0 auto; background: #031527; border: 1px solid #164e63; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); text-align: center;">
        
        <!-- Brand Header -->
        <div style="margin-bottom: 28px;">
          <h1 style="color: #ffffff; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: 0.5px;">
            Quran<span style="color: #22d3ee;">Mind</span>
          </h1>
          <p style="color: #06b6d4; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">
            المنصة الذكية للبحث القرآني والتحقيق الأكاديمي
          </p>
        </div>

        <!-- Greeting -->
        <div style="text-align: right; margin-bottom: 24px;">
          <h2 style="font-size: 17px; color: #ffffff; margin: 0 0 10px 0;">أهلاً بك، ${userName} 👋</h2>
          <p style="font-size: 14px; color: #94a3b8; line-height: 1.7; margin: 0;">
            شكراً لانضمامك إلى منصة <strong>QuranMind</strong>. لإتمام تفعيل حسابك وحماية بياناتك البحثية، يرجى استخدام رمز التحقق أدناه:
          </p>
        </div>

        <!-- 6-Digit PIN Code Box -->
        <div style="margin: 32px 0; background: #04243e; border: 2px dashed #0891b2; border-radius: 16px; padding: 22px 16px;">
          <span style="display: block; font-size: 12px; color: #67e8f9; margin-bottom: 8px; font-weight: 600;">رمز التحقق الخاص بك (PIN Code)</span>
          <span style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #38bdf8; text-shadow: 0 0 12px rgba(56,189,248,0.4);">
            ${code}
          </span>
        </div>

        <!-- Direct Verification Link -->
        <div style="margin-bottom: 30px;">
          <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #2563eb); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 15px rgba(6,182,212,0.35);">
            تأكيد البريد الإلكتروني مباشرة ←
          </a>
        </div>

        <!-- Expiry and Security Notice -->
        <div style="border-top: 1px solid #0f2d4a; padding-top: 20px; text-align: center;">
          <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0;">
            ⏳ هذا الرمز صالح لمدة <strong>15 دقيقة</strong> فقط.
          </p>
          <p style="font-size: 11px; color: #475569; margin: 0;">
            إذا لم تقم بطلب هذا الرمز، يرجى تجاهل هذا البريد ولن يتم اتخاذ أي إجراء على حسابك.
          </p>
        </div>

      </div>
    </body>
    </html>
    `
  }
}

export const emailService = new EmailService()
