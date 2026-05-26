import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit'

/**
 * POST /api/webhooks/stripe — handle Stripe webhook events.
 * Verifies signature using STRIPE_WEBHOOK_SECRET.
 * Idempotent: short-circuits on duplicate event IDs.
 */
export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    logger.error({ err }, 'Stripe webhook signature verification failed')
    return new Response('Webhook verification failed', { status: 400 })
  }

  const supabase = createAdminClient()

  // Idempotency gate — Stripe retries on 5xx; short-circuit duplicates
  const { data: already } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle()

  if (already) {
    return new Response('OK', { status: 200 })
  }

  // Stamp the event — ignore duplicate-key error from concurrent retries
  await supabase
    .from('stripe_events')
    .insert({ id: event.id, event_type: event.type })
    .then(() => {})

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as unknown as {
        customer_email: string
        metadata: { user_id: string; plan: string }
        subscription: string
      }
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan

      if (!userId || !plan) {
        logger.error({ session_metadata: session.metadata }, 'Stripe webhook: missing metadata')
        return new Response('Missing metadata', { status: 400 })
      }

      const stripeSub = await stripe.subscriptions.retrieve(session.subscription)
      const stripeCustomerId = stripeSub.customer as string

      const { data: existing } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', stripeCustomerId)
        .maybeSingle()

      if (existing?.user_id && existing.user_id !== userId) {
        logger.error({ stripeCustomerId, metadataUserId: userId, existingUserId: existing.user_id },
          'Stripe webhook: customer/user mismatch')
        return new Response('Customer/user mismatch', { status: 400 })
      }

      const { data: prev } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('stripe_customer_id', stripeCustomerId)
        .maybeSingle()

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_sub_id: stripeSub.id,
        plan,
        status: stripeSub.status === 'active' ? 'active' : 'trialing',
        current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: stripeSub.cancel_at_period_end,
      }, { onConflict: 'user_id' })

      await audit({
        userId,
        event: prev ? 'subscription.updated' : 'subscription.created',
        resource: 'subscriptions',
        resourceId: stripeSub.id,
        diff: { plan, status: stripeSub.status },
      })
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as {
        id: string
        customer: string
        status: string
        current_period_end: number
        cancel_at_period_end: boolean
      }

      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_sub_id', sub.id)
        .maybeSingle()

      await supabase.from('subscriptions')
        .update({
          status: sub.status === 'active' ? 'active' : sub.status === 'canceled' ? 'canceled' : 'past_due',
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        })
        .eq('stripe_sub_id', sub.id)

      if (subRow?.user_id) {
        await audit({
          userId: subRow.user_id,
          event: 'subscription.updated',
          resource: 'subscriptions',
          resourceId: sub.id,
          diff: { status: sub.status },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as { id: string }

      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_sub_id', sub.id)
        .maybeSingle()

      await supabase.from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_sub_id', sub.id)

      if (subRow?.user_id) {
        await audit({
          userId: subRow.user_id,
          event: 'subscription.canceled',
          resource: 'subscriptions',
          resourceId: sub.id,
        })
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as { customer: string; subscription: string }

      const { data: subRow } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', invoice.customer)
        .maybeSingle()

      await supabase.from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', invoice.customer)

      if (subRow?.user_id) {
        await audit({
          userId: subRow.user_id,
          event: 'subscription.payment_failed',
          resource: 'subscriptions',
          resourceId: invoice.subscription,
        })
      }
      break
    }
  }

  return new Response('OK', { status: 200 })
}