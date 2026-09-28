'use client'

import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

const hasValidKey = Boolean(
  publishableKey &&
    publishableKey.startsWith('pk_') &&
    !publishableKey.includes('placeholder')
)

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
      {children}
    </ClerkProvider>
  )
}
