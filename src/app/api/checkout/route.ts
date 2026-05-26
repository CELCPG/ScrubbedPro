import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, rateLimitResponse } from '@/lib/utils/rate-limit'
import { logger } from '@/lib/logger'

const ALLOWED_PLANS = new Set(['individual', 'family', 'small_biz'])
const ALLOWED_INTERVALS = new Set(['monthly', 'annual'])

/**
 * POST /api/checkout — create a Stripe Checkout session.
 * Body: { plan: 'individual' | 'family' | 'small_biz', interval: 'monthly' | 'annual' }
 */
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 5 checkout attempts per minute per user
  const rl = await checkRateLimit(`checkout:${user.id}`, 5, 60_000)
  if (!rl.ok) return rateLimitResponse(rl)

  let body: { plan?: unknown; interval?: unknown }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const plan = typeof body.plan === 'string' ? body.plan : ''
  const interval = typeof body.interval === 'string' ? body.interval : ''

  if (!ALLOWED_PLANS.has(plan) || !ALLOWED_INTERVALS.has(interval)) {
    return new Response(JSON.stringify({ error: 'Invalid plan or interval' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const priceKey = `STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}` as keyof typeof process.env
  const priceId = process.env[priceKey]

  if (!priceId) {
    return new Response(JSON.stringify({ error: 'Invalid plan or interval' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan,
      },
      // Collect billing address for Stripe Tax calculation
      billing_address_collection: 'required',
      // Collect tax ID (EU VAT etc.) — requires Stripe Tax to be enabled
      // in the Stripe dashboard before automatic_tax will actually compute tax
      tax_id_collection: { enabled: true },
      // NOTE: automatic_tax.enabled requires Stripe Tax to be configured in the
      // Stripe dashboard. Stripe will ignore this flag if Tax is not enabled.
      automatic_tax: { enabled: true },
      // Enable Stripe-hosted invoice generation + automatic receipt emails
      invoice_creation: { enabled: true },
    })

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    logger.error({ err, user_id: user.id, plan, interval }, 'checkout session creation failed')
    return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}