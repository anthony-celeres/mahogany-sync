// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Request Interceptor (replaces deprecated middleware.ts).
 * This function intercepts requests to refresh the mock session,
 * enforces path-based authentication, and performs Role-Based Access Control (RBAC).
 */
export async function proxy(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next()

  const pathname = request.nextUrl.pathname
  const sessionCookie = request.cookies.get('mahogany_sync_session')

  let user: any = null
  if (sessionCookie) {
    try {
      // Decode URL encoding if client-side wrote it encoded
      let val = sessionCookie.value
      if (val.startsWith('%')) {
        val = decodeURIComponent(val)
      }
      user = JSON.parse(val)
    } catch (e) {
      // Ignore parse errors
    }
  }

  // 1. Protected Route Boundary: Redirect unauthenticated users trying to access /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      const loginUrl = new URL('/', request.url)
      // Pass the original destination path as a redirect parameter
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 1b. Role-Based Access Control: Protect admin routes
    // Developers are an elevated tier and may pass admin-gated routes for testing.
    if (pathname.startsWith('/dashboard/admin')) {
      const role = user.user_metadata?.role || 'user'
      if (role !== 'admin' && role !== 'developer') {
        const redirectUrl = new URL('/dashboard', request.url)
        redirectUrl.searchParams.set('error', 'Access denied: Admin credentials required')
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return response
}

// Config to run the proxy on specific paths, skipping static assets and internal next files
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets like svg, png, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
