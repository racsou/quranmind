import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

// Common disposable / burner email domains
const DISPOSABLE_DOMAINS = new Set([
  '10minutemail.com',
  '10minutemail.net',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'mailinator.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'fakeinbox.com',
  'dispostable.com',
  'trashmail.com',
  'trashmail.net',
  'getairmail.com',
  'fakemailgenerator.com',
  'burnermail.io',
  'crazymailing.com',
  'inboxkitten.com',
  'tempail.com',
  'nada.ltd',
  'getnada.com',
  'mohmal.com',
  'mytemp.email',
])

export interface EmailValidationResult {
  isValid: boolean
  error?: string
  normalizedEmail?: string
  domain?: string
  hasMx?: boolean
}

/**
 * Validates if an email is a real, valid, and active email address
 * Performs:
 * 1. Syntax & RFC RFC 5322 validation
 * 2. Disposable / temporary email service detection
 * 3. DNS MX Record lookup to confirm the domain actually handles incoming emails
 */
export async function validateRealEmail(email: string): Promise<EmailValidationResult> {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'البريد الإلكتروني مطلوب.' }
  }

  const clean = email.trim().toLowerCase()

  // 1. Basic length checks
  if (clean.length > 254) {
    return { isValid: false, error: 'عنوان البريد الإلكتروني طويل جداً (الحد الأقصى 254 حرفاً).' }
  }

  // 2. Strict RFC 5322 Regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'صيغة البريد الإلكتروني غير صحيحة، يرجى التأكد من كتابته بشكل صحيح (مثال: name@domain.com).' }
  }

  const parts = clean.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'البريد الإلكتروني يجب أن يحتوي على علامة @ واحدة فقط.' }
  }

  const [localPart, domain] = parts

  if (localPart.length > 64) {
    return { isValid: false, error: 'اسم المستخدم في البريد الإلكتروني طويل جداً (الحد الأقصى 64 حرفاً).' }
  }

  // 3. Block Disposable / Burner Domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'لا يُسمح باستخدام عناوين البريد الإلكتروني المؤقتة أو الوهمية (Disposable Emails). يرجى استخدام بريد إلكتروني حقيقي.',
    }
  }

  // Common typo hints
  if (domain === 'gmai.com' || domain === 'gamil.com' || domain === 'gmaill.com') {
    return { isValid: false, error: 'هل تقصد @gmail.com؟ يرجى تصحيح كتابة النطاق.' }
  }
  if (domain === 'hotmial.com' || domain === 'hotmaill.com') {
    return { isValid: false, error: 'هل تقصد @hotmail.com؟ يرجى تصحيح كتابة النطاق.' }
  }
  if (domain === 'yaho.com' || domain === 'yahou.com') {
    return { isValid: false, error: 'هل تقصد @yahoo.com؟ يرجى تصحيح كتابة النطاق.' }
  }

  // Allow test / local development domains
  if (
    domain === 'quranmind.ai' ||
    domain === 'localhost' ||
    domain.endsWith('.test') ||
    domain.endsWith('.local')
  ) {
    return { isValid: true, normalizedEmail: clean, domain, hasMx: true }
  }

  // 4. DNS MX Record Resolution (Confirms the domain actually exists and accepts mail!)
  try {
    const mxRecords = await Promise.race([
      resolveMx(domain),
      new Promise<dns.MxRecord[]>((_, reject) =>
        setTimeout(() => reject(new Error('DNS_TIMEOUT')), 3500)
      ),
    ])

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        error: `النطاق (@${domain}) لا يمتلك خوادم بريد نشطة (MX Records). يرجى التأكد من كتابة البريد بشكل صحيح.`,
      }
    }

    return {
      isValid: true,
      normalizedEmail: clean,
      domain,
      hasMx: true,
    }
  } catch (err: any) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      return {
        isValid: false,
        error: `النطاق (@${domain}) غير موجود أو غير مفعل لاستقبال البريد الإلكتروني. يرجى إدخال بريد حقيقي.`,
      }
    }

    // In case of timeout or offline sandbox, allow standard major providers (gmail, yahoo, outlook, etc.)
    const knownMajorDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'proton.me', 'protonmail.com']
    if (knownMajorDomains.includes(domain)) {
      return { isValid: true, normalizedEmail: clean, domain, hasMx: true }
    }

    return {
      isValid: false,
      error: `تعذر التحقق من خوادم البريد الإلكتروني للنطاق (@${domain}). يرجى التحقق من صحة البريد.`,
    }
  }
}
