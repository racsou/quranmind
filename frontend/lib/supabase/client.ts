import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

// Public Supabase client for browser usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with elevated service role
export function getServiceSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Storage helpers for QuranMind research dossiers and scientific evidence files
export const STORAGE_BUCKETS = {
  RESEARCH_EXPORTS: 'research-exports',
  EVIDENCE_DOCS: 'evidence-documents',
} as const

export async function uploadResearchExport(
  fileName: string,
  content: string | Blob,
  contentType = 'application/json'
) {
  if (!isSupabaseConfigured) {
    console.info(`[Supabase Mock] Simulating upload for ${fileName}`)
    return {
      path: `mock-exports/${fileName}`,
      publicUrl: `/mock-storage/${fileName}`,
    }
  }

  const client = getServiceSupabase()
  const { data, error } = await client.storage
    .from(STORAGE_BUCKETS.RESEARCH_EXPORTS)
    .upload(fileName, content, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload to Supabase: ${error.message}`)
  }

  const { data: urlData } = client.storage
    .from(STORAGE_BUCKETS.RESEARCH_EXPORTS)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  }
}
