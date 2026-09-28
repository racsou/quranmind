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
  isSupabaseConfigured(): boolean {
    return Boolean(
      this.supabase.url &&
        !this.supabase.url.includes('placeholder') &&
        (this.supabase.serviceRoleKey || this.supabase.anonKey)
    )
  },
}
