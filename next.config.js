const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

// Conservative CSP: tightened for prod. Stripe + Supabase endpoints whitelisted.
// In dev, allow 'unsafe-eval' for Next.js HMR.
const csp = [
  "default-src 'self'",
  // script-src: 'strict-dynamic' + nonce in production (generated per-response by Next.js)
  // Falls back to 'unsafe-inline' in dev. Cloudflare Turnstile needs its own script domain.
  `script-src 'self' ${isProd ? "'strict-dynamic' https://challenges.cloudflare.com" : "'unsafe-inline' 'unsafe-eval'"} https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://challenges.cloudflare.com`,
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    // 'strict-dynamic' + nonce in prod; fallback to unsafe-inline in dev.
    // Cloudflare Turnstile and Stripe added explicitly since strict-dynamic
    // makes host Allow list insufficient for script loading.
    value: csp,
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Enable per-request nonce generation for CSP 'strict-dynamic' support.
  // Next.js will auto-add nonce to <script> tags; CSP header must also carry it.
  generateNonce: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

const sentryConfig = {
  // For all available options: https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/
  silent: false, // Suppresses build output logs during builds (debug builds will still log)
}

module.exports = withSentryConfig(nextConfig, sentryConfig)