import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const protectedPrefixes = ['/dashboard', '/api/projects', '/api/evidence']

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname

  if (path === '/workspace' || path.startsWith('/workspace/')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protected Admin Routes: /admin and /admin/* (except /admin/login)
  if (path === '/admin' || (path.startsWith('/admin/') && path !== '/admin/login')) {
    const hasAdminCookie = req.cookies.get('quranmind_admin_auth')?.value === 'true'
    if (!hasAdminCookie) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Email Confirmation Enforcement: Users cannot access dashboard until email is confirmed
  if (path.startsWith('/dashboard')) {
    const hasUnverifiedEmail = Boolean(req.cookies.get('qm_unverified_email')?.value)
    const isEmailConfirmed = req.cookies.get('qm_email_confirmed')?.value === 'true' && !hasUnverifiedEmail
    const isAdmin = req.cookies.get('quranmind_admin_auth')?.value === 'true'

    // Block access to dashboard if email is not confirmed or unverified email is pending
    if (!isEmailConfirmed && !isAdmin) {
      const unverifiedEmail = req.cookies.get('qm_unverified_email')?.value
      const verifyUrl = new URL('/verify-email', req.url)
      if (unverifiedEmail) {
        verifyUrl.searchParams.set('email', unverifiedEmail)
      }
      return NextResponse.redirect(verifyUrl)
    }
  }

  if (!hasClerkKeys) {
    return NextResponse.next()
  }

  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix))
  if (isProtected) {
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/login', req.url)
      signInUrl.searchParams.set('redirect_url', path)
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
