import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const protectedPrefixes = ['/workspace', '/dashboard', '/api/projects', '/api/evidence']

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default clerkMiddleware(async (auth, req) => {
  if (!hasClerkKeys) {
    return NextResponse.next()
  }

  const path = req.nextUrl.pathname
  const isProtected = protectedPrefixes.some((prefix) => path.startsWith(prefix))
  const isPreview = req.nextUrl.searchParams.get('preview') === 'true' || req.cookies.get('qm_preview')?.value === 'true'

  if (isProtected && !isPreview) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
