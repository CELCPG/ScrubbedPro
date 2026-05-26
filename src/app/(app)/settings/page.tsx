'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/ToastProvider'
import type { Subscription } from '@/types'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState({
    scanComplete: true,
    removalVerified: true,
    relistedAlert: true,
    monthlySummary: true,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      setUser(session.user as any)
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

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast('Signed out.', 'info')
    router.push('/')
  }

  const openBillingPortal = async () => {
    const res = await fetch('/api/portal', { method: 'POST' })
    const { url } = await res.json()
    window.location.href = url
  }

  const statusColors = {
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

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-medium tracking-tight text-navy">Settings</h1>

      {/* Account */}
      <Card className="mt-6">
        <h2 className="text-base font-medium text-navy mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
            <div className="mt-1 text-sm font-medium text-gray-700">{user?.email}</div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="mt-4">
        <h2 className="text-base font-medium text-navy mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'scanComplete', label: 'Email when scan completes' },
            { key: 'removalVerified', label: 'Email when removal is verified' },
            { key: 'relistedAlert', label: 'Email when re-listing is detected' },
            { key: 'monthlySummary', label: 'Monthly summary email' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-700">{label}</span>
              <input
                type="checkbox"
                checked={notifications[key as keyof typeof notifications]}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
              />
            </label>
          ))}
        </div>
      </Card>

      {/* Billing */}
      <Card className="mt-4">
        <h2 className="text-base font-medium text-navy mb-4">Billing</h2>
        {subscription ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700 capitalize">{subscription.plan}</span>
                <Badge variant={statusColors[subscription.status] as any} className="ml-2 text-xs">
                  {subscription.status}
                </Badge>
              </div>
              {subscription.current_period_end && (
                <span className="text-xs text-gray-400">
                  Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                </span>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={openBillingPortal}>
              Manage billing →
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-3">No active subscription.</p>
            <Button variant="secondary" size="sm" onClick={() => router.push('/pricing')}>
              View plans →
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}