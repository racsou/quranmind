'use client'

import React, { useEffect } from 'react'
import { ClerkProvider, useUser } from '@clerk/nextjs'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

const hasValidKey = Boolean(
  publishableKey &&
    publishableKey.startsWith('pk_') &&
    !publishableKey.includes('placeholder')
)

function ClerkSupabaseSync() {
  const { isSignedIn, user } = useUser()

  useEffect(() => {
    if (isSignedIn && user) {
      const savedRole =
        typeof window !== 'undefined'
          ? localStorage.getItem('qm_signup_role') || 'student'
          : 'student'

      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: savedRole }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.emailConfirmed === false) {
            // Delete confirmation cookie to force verification
            document.cookie = 'qm_email_confirmed=; path=/; max-age=0;'
            const unverifiedEmail =
              data.email || user.primaryEmailAddress?.emailAddress || ''
            if (unverifiedEmail) {
              document.cookie = `qm_unverified_email=${encodeURIComponent(
                unverifiedEmail
              )}; path=/; max-age=86400; SameSite=Lax`
              try {
                localStorage.setItem('qm_unverified_email', unverifiedEmail)
              } catch {}
            }

            if (
              typeof window !== 'undefined' &&
              window.location.pathname.startsWith('/dashboard')
            ) {
              window.location.href =
                data.redirect ||
                `/verify-email?email=${encodeURIComponent(unverifiedEmail)}`
            }
          }
        })
        .catch((e) => console.warn('Clerk to Supabase sync warning:', e))
    }
  }, [isSignedIn, user])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidKey) {
    // If Clerk key is not provided yet, render children directly so local dev / preview works seamlessly
    return <>{children}</>
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: '#00d4ff',
          colorBackground: '#031426',
          borderRadius: '8px',
          fontFamily: 'var(--font-cairo), sans-serif',
        },



        elements: {
          card: {
            border: '1px solid #143958',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          },
          formButtonPrimary: {
            backgroundColor: '#00d4ff',
            color: '#020e1d',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#00b8e6',
            },
          },
          footerActionLink: {
            color: '#00d4ff',
            '&:hover': {
              color: '#33ddff',
            },
          },
        },
      }}
    >
      <ClerkSupabaseSync />
      {children}
    </ClerkProvider>
  )
}
