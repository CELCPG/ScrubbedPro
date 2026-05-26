/**
 * Upstash Redis sliding-window rate limiter.
 * Spans all instances — safe for Vercel/Railway/etc.
 *
 * Falls back to in-memory limiter if UPSTASH_REDIS_REST_URL is not set
 * (e.g., local dev without Redis).
 */
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── In-memory fallback (local dev without Redis) ──────────────────────────
type Bucket = { timestamps: number[] }
const buckets = new Map<string, Bucket>()
let lastSweep = 0

function sweepInMemory(now: number, windowMs: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  buckets.forEach((b, key) => {
    b.timestamps = b.timestamps.filter((t: number) => now - t < windowMs)
    if (b.timestamps.length === 0) buckets.delete(key)
  })
}

function checkInMemory(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  sweepInMemory(now, windowMs)

  const bucket = buckets.get(key) ?? { timestamps: [] }
  bucket.timestamps = bucket.timestamps.filter((t: number) => now - t < windowMs)

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0]
    const retryAfterMs = windowMs - (now - oldest)
    buckets.set(key, bucket)
    return { ok: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) }
  }

  bucket.timestamps.push(now)
  buckets.set(key, bucket)
  return { ok: true, remaining: limit - bucket.timestamps.length, retryAfterSeconds: 0 }
}

// ── Upstash Redis limiter ───────────────────────────────────────────────────
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per 60 seconds
      analytics: true,
      prefix: 'scrubbed:ratelimit',
    })
  : null

export interface RateLimitResult {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Check a rate limit. Uses Upstash Redis if configured, in-memory fallback otherwise.
 *
 * @param identifier  — unique key per user/action (e.g. `checkout:${userId}`)
 * @param limit     — max requests per window (ignored when Redis is active; set in Upstash dashboard)
 * @param windowMs  — window in milliseconds (informational only for Redis)
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  // Redis path
  if (ratelimit) {
    const result = await ratelimit.limit(identifier)
    return {
      ok: result.success,
      remaining: result.remaining,
      retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    }
  }

  // In-memory fallback
  return checkInMemory(identifier, limit, windowMs) as unknown as Promise<RateLimitResult>
}

export function rateLimitResponse(result: RateLimitResult) {
  return new Response(
    JSON.stringify({ error: 'Too many requests', retryAfter: result.retryAfterSeconds }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfterSeconds),
      },
    },
  )
}