import dns from 'dns'

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'throwawaymail.com',
  'trashmail.com',
  'getairmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'dispostable.com',
  'mytemp.email',
  'burnermail.io',
  'temp-mail.org',
  'fakeinbox.com',
  'crazymailing.com',
  'mohmal.com',
  'maildrop.cc',
])

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export interface EmailValidationResult {
  isValid: boolean
  error?: string
  normalizedEmail?: string
  domain?: string
}

export async function validateRealEmail(email: string): Promise<EmailValidationResult> {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'البريد الإلكتروني مطلوب' }
  }

  const clean = email.trim().toLowerCase()

  if (clean.length > 254) {
    return { isValid: false, error: 'البريد الإلكتروني طويل جداً' }
  }

  if (!EMAIL_REGEX.test(clean)) {
    return { isValid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' }
  }

  const parts = clean.split('@')
  if (parts.length !== 2) {
    return { isValid: false, error: 'صيغة البريد الإلكتروني غير صحيحة' }
  }

  const [localPart, domain] = parts

  if (localPart.length > 64) {
    return { isValid: false, error: 'اسم المستخدم في البريد الإلكتروني طويل جداً' }
  }

  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'لا يُقبل استخدام عناوين البريد المؤقتة أو الوهمية. يرجى استخدام بريد إلكتروني حقيقي.',
    }
  }

  // Live DNS MX Record check
  try {
    const mxRecords = await dns.promises.resolveMx(domain)
    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        error: `النطاق (${domain}) لا يحتوي على خوادم بريد (MX records) لتلقي الرسائل.`,
      }
    }
  } catch (dnsErr: any) {
    if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA') {
      return {
        isValid: false,
        error: `نطاق البريد الإلكتروني (${domain}) غير موجود أو غير نشط.`,
      }
    }
  }

  return {
    isValid: true,
    normalizedEmail: clean,
    domain,
  }
}
