'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import type { Subscription } from '@/types'
import { PLANS } from '@/lib/stripe/plans'

export default function BillingPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data }) => {
          setSubscription(data as any)
          setLoading(false)
        })
    })
  }, [router])

  const { toast } = useToast()
  const handleCheckout = async (plan: string, interval: 'monthly' | 'annual') => {
    setCheckoutLoading(`${plan}-${interval}`)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, interval }),
    })
    const { url, error } = await res.json()
    if (error) {
      toast('Failed to start checkout. Try again.', 'error')
      setCheckoutLoading(null)
    } else if (url) {
      window.location.href = url
    }
  }

  const statusColors: Record<string, string> = {
    active: 'bg-safe-light text-safe',
    canceled: 'bg-gray-100 text-gray-500',
    past_due: 'bg-risk-light text-risk',
    trialing: 'bg-sky text-navy',
    incomplete: 'bg-critical-light text-critical',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const plan = subscription?.plan ? PLANS[subscription.plan as keyof typeof PLANS] : null

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-medium tracking-tight text-navy">Billing</h1>

      {/* Current plan */}
      {plan && subscription && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-navy">{plan.name} plan</h2>
              <Badge variant={statusColors[subscription.status] as any} className="mt-1">
                {subscription.status}
              </Badge>
              <div className="mt-2 text-sm text-gray-500">
                ${(plan.price_monthly / 1).toFixed(0)}/month
                {subscription.current_period_end && (
                  <span className="ml-3">
                    Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => fetch('/api/portal', { method: 'POST' }).then(r => r.json()).then(d => { if (d.url) window.location.href = d.url })}>
              Manage billing
            </Button>
          </div>
        </Card>
      )}

      {!subscription && (
        <Card className="mt-6 text-center py-8">
          <p className="text-gray-500 text-sm mb-4">No active subscription.</p>
          <Button onClick={() => setShowPlanModal(true)}>View plans</Button>
        </Card>
      )}

      {/* Plan selector modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPlanModal(false) }}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-medium text-navy mb-4">Change plan</h2>
            <div className="space-y-3">
              {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, p]) => (
                <Card key={key} className={p.highlight ? 'border-2 border-navy' : ''}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-navy">{p.name}</span>
                      {p.highlight && <span className="ml-2 text-xs bg-navy text-white rounded-full px-2 py-0.5">Most popular</span>}
                      <div className="mt-1 text-sm text-gray-500">${p.price_monthly}/month or ${p.price_annual}/year</div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShowPlanModal(false)
                        setCheckoutLoading(`${key}-monthly`)
                        fetch('/api/checkout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ plan: key, interval: 'monthly' }),
                        }).then(r => r.json()).then(d => { window.location.href = d.url })
                      }}
                      disabled={!!checkoutLoading}
                    >
                      Switch
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full" onClick={() => setShowPlanModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}