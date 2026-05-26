import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Routes that do NOT require authentication.
 * All other routes require a valid user session.
 */
const PUBLIC_ROUTES = [
  // Marketing
  '/',
  '/pricing',
  '/how-it-works',
  '/faq',
  '/privacy',
  '/terms',
  // Auth
  '/login',
  '/signup',
  '/reset-password',
] as const

/** Route prefixes that are always public */
const PUBLIC_PREFIXES = [
  '/api/auth',        // Supabase auth endpoints
  '/api/webhooks',    // Stripe + scanner webhooks (verified by signature/secret)
  '/api/healthcheck', // Health check
] as const

function isPublicRoute(pathname: string): boolean {
  if ((PUBLIC_ROUTES as readonly string[]).includes(pathname)) return true
  return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  // Skip auth for public routes — allow them through without redirect
  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // API requests get JSON 401; browser navigations get redirected to /login
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      )
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  /**
   * Match everything EXCEPT static files and Next.js internals.
   * The explicit auth check in the handler above is the real guard.
   */
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|public/).*)',
  ],
}