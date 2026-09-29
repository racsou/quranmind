import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  email: {
    service: process.env.SMTP_SERVICE, // e.g. 'gmail'
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    user: (process.env.SMTP_USER || '').trim(),
    pass: (process.env.SMTP_PASS || '').trim().replace(/\s+/g, ''),
    from: (process.env.EMAIL_FROM || '').trim() || 'QuranMind <no-reply@quranmind.ai>',
  },
  isSupabaseConfigured(): boolean {
    return Boolean(
      this.supabase.url &&
        !this.supabase.url.includes('placeholder') &&
        (this.supabase.serviceRoleKey || this.supabase.anonKey)
    )
  },
  isEmailConfigured(): boolean {
    return Boolean(this.email.user && this.email.pass)
  },
}
