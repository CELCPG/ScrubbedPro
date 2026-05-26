'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/ToastProvider'
import type { RemovalQueueItem } from '@/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

type TabType = 'pending' | 'in_progress' | 'verified_removed' | 're_listed' | 'requires_manual'

const tabConfig: { key: TabType; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'verified_removed', label: 'Verified removed' },
  { key: 're_listed', label: 'Re-listed' },
  { key: 'requires_manual', label: 'Manual required' },
]

const statusBadgeVariant = {
  pending: 'default',
  submitted: 'sky',
  verification_pending: 'risk',
  verified_removed: 'safe',
  re_listed: 'critical',
  failed: 'risk',
  requires_manual: 'risk',
} as const

const methodLabel = {
  web_form: 'Automated',
  email: 'Email',
  manual: 'Manual',
}

export default function RemovalPage() {
  const router = useRouter()
  const [items, setItems] = useState<RemovalQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      supabase
        .from('removal_queue')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setItems(data || [])
          setLoading(false)
        })
    })
  }, [router])

  const tabCounts = {
    pending: items.filter(i => i.status === 'pending').length,
    in_progress: items.filter(i => ['submitted', 'verification_pending'].includes(i.status)).length,
    verified_removed: items.filter(i => i.status === 'verified_removed').length,
    re_listed: items.filter(i => i.status === 're_listed').length,
    requires_manual: items.filter(i => i.status === 'requires_manual').length,
  }

  const filteredItems = items.filter(i => {
    if (activeTab === 'pending') return i.status === 'pending'
    if (activeTab === 'in_progress') return ['submitted', 'verification_pending'].includes(i.status)
    if (activeTab === 'verified_removed') return i.status === 'verified_removed'
    if (activeTab === 're_listed') return i.status === 're_listed'
    if (activeTab === 'requires_manual') return i.status === 'requires_manual'
    return false
  })

  const { toast } = useToast()
  const submitRemoval = async (item: RemovalQueueItem) => {
    setSubmitting(item.id)
    const res = await fetch('/api/removal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broker_result_id: item.broker_result_id }),
    })
    if (res.ok) {
      setItems(items.map(i => i.id === item.id ? { ...i, status: 'submitted' as const } : i))
      toast(`${item.broker_name} opt-out submitted.`, 'success')
    } else {
      toast('Failed to submit removal. Try again.', 'error')
    }
    setSubmitting(null)
  }

  const priorityColors = {
    high: 'bg-critical-light text-critical',
    medium: 'bg-risk-light text-risk',
    low: 'bg-gray-100 text-gray-600',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium tracking-tight text-navy">Removal queue</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track and manage your opt-out requests.
      </p>

      {/* Legal callout */}
      <Card className="mt-4 border border-blue/20 bg-blue/5">
        <p className="text-xs text-gray-600 leading-relaxed">
          You have the right to request removal under CCPA, CDPA, and similar state privacy laws.
          We never submit more than your name and address to a broker. We never provide
          government ID, even when requested.
        </p>
      </Card>

      {/* Tab navigation */}
      <div className="mt-6 flex items-center gap-1 border-b border-gray-100">
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-navy text-navy'
                : 'border-transparent text-gray-500 hover:text-navy'
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs">
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="mt-4 space-y-2">
        {filteredItems.length === 0 ? (
          <Card className="py-8 text-center text-sm text-gray-500">
            No items in this tab.
          </Card>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-4">
                <span className="font-medium text-navy w-40">{item.broker_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColors[item.priority]}`}>
                  {item.priority}
                </span>
                <span className="text-xs text-gray-500">
                  {methodLabel[item.opt_out_method || 'web_form']}
                </span>
                {item.estimated_removal_days && (
                  <span className="text-xs text-gray-400">
                    ~{item.estimated_removal_days} days
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={statusBadgeVariant[item.status] as any}>
                  {item.status.replace('_', ' ')}
                </Badge>
                {item.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => submitRemoval(item)}
                    disabled={submitting === item.id}
                  >
                    {submitting === item.id ? 'Submitting…' : 'Submit'}
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}