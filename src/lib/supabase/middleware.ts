import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * Auth middleware — protects app routes.
 * Redirects unauthenticated users to /login.
 * Redirects authenticated users away from auth pages.
 */
export async function updateMiddleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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

  let user
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    logger.error({ err }, 'Supabase auth getUser failed in middleware')
    // Still allow request through — don't block on auth errors
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/signup') ||
                     request.nextUrl.pathname.startsWith('/reset-password')

  const isAppPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                   request.nextUrl.pathname.startsWith('/scan') ||
                   request.nextUrl.pathname.startsWith('/brokers') ||
                   request.nextUrl.pathname.startsWith('/removal') ||
                   request.nextUrl.pathname.startsWith('/profile') ||
                   request.nextUrl.pathname.startsWith('/settings') ||
                   request.nextUrl.pathname.startsWith('/history')

  if (!user && isAppPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}