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

  if (!hasClerkKeys) {
    return NextResponse.next()
  }

  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix))
  if (isProtected) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
