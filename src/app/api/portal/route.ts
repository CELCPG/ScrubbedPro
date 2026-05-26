import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, rateLimitResponse } from '@/lib/utils/rate-limit'

/**
 * POST /api/portal — create a Stripe Customer Portal session.
 */
export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 10 portal sessions per minute per user
  const rl = await checkRateLimit(`portal:${user.id}`, 10, 60_000)
  if (!rl.ok) return rateLimitResponse(rl)

  // Look up the user's Stripe customer ID
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!sub?.stripe_customer_id) {
    return new Response(JSON.stringify({ error: 'No billing account found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}