import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { config } from '../config/index.js'

let publicClient: SupabaseClient | null = null
let serviceClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (publicClient) return publicClient

  const url = config.supabase.url || 'https://placeholder.supabase.co'
  const key = config.supabase.anonKey || config.supabase.serviceRoleKey || 'placeholder-key'

  publicClient = createClient(url, key, {
    auth: { persistSession: false },
  })

  return publicClient
}

export function getServiceSupabase(): SupabaseClient {
  if (serviceClient) return serviceClient

  const url = config.supabase.url || 'https://placeholder.supabase.co'
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey || 'placeholder-service-key'

  serviceClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return serviceClient
}
