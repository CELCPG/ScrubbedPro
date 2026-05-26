import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { checkRateLimit, rateLimitResponse } from '@/lib/utils/rate-limit'

/**
 * POST /api/auth/verify-turnstile — verify a Cloudflare Turnstile token.
 * Used by the signup form before submitting to Supabase Auth.
 *
 * The TURNSTILE_SECRET_KEY is server-only and MUST NOT be exposed to the client.
 *
 * Body: { token: string }
 * Response: { success: boolean, error?: string }
 *
 * NOTE: This route is allowlisted in middleware (PUBLIC_PREFIXES: /api/auth).
 */
export async function POST(request: Request) {
  // Rate limit by IP to prevent token-grinding
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  const rl = await checkRateLimit(`turnstile:${ip}`, 30, 60_000)
  if (!rl.ok) return rateLimitResponse(rl)

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // No secret configured — fail closed in production, allow in dev
    if (process.env.NODE_ENV === 'production') {
      logger.error('TURNSTILE_SECRET_KEY not configured in production')
      return NextResponse.json({ success: false, error: 'CAPTCHA not configured' }, { status: 500 })
    }
    return NextResponse.json({ success: true, dev: true })
  }

  let body: { token?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const token = typeof body.token === 'string' ? body.token : ''
  if (!token) {
    return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })
  }

  try {
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    })
    const data = (await verifyRes.json()) as { success: boolean; 'error-codes'?: string[] }

    if (!data.success) {
      logger.warn({ ip, codes: data['error-codes'] }, 'Turnstile verification failed')
      return NextResponse.json({ success: false, error: 'CAPTCHA failed' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error({ err, ip }, 'Turnstile siteverify request failed')
    return NextResponse.json({ success: false, error: 'Verification error' }, { status: 502 })
  }
}
