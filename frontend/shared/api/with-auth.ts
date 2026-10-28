import { auth } from '@clerk/nextjs/server'

export interface AuthContext {
  userId: string | null
  isConfigured: boolean
}

export async function getAuthContext(): Promise<AuthContext> {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
  )

  if (!isConfigured) {
    return { userId: null, isConfigured: false }
  }

  try {
    const session = await auth()
    return { userId: session.userId || null, isConfigured: true }
  } catch {
    return { userId: null, isConfigured: false }
  }
}

export async function requireAuth(): Promise<{ userId: string } | null> {
  const { userId, isConfigured } = await getAuthContext()
  if (!isConfigured) {
    // Fallback for local development or non-Clerk mode
    return { userId: 'local_dev_user' }
  }
  return userId ? { userId } : null
}
