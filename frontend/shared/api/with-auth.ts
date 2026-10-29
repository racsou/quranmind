export interface AuthContext {
  userId: string
  isConfigured: boolean
}

export async function getAuthContext(): Promise<AuthContext> {
  return { userId: 'local_dev_user', isConfigured: false }
}

export async function requireAuth(): Promise<{ userId: string }> {
  return { userId: 'local_dev_user' }
}
