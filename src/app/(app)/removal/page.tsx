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

type TabType = 'pending' | 'in_progress' | 'verified_removed' | 're_listed' | 'requires_manual'

const tabConfig: { key: TabType; label: string }[] = [
  { key: 'pending',       label: 'Pending' },
  { key: 'in_progress',   label: 'In progress' },
  { key: 'verified_removed', label: 'Verified removed' },
  { key: 're_listed',     label: 'Re-listed' },
  { key: 'requires_manual', label: 'Manual required' },
]

const statusBadgeVariant: Record<string, 'default' | 'risk' | 'critical' | 'safe' | 'sky'> = {
  pending:             'default',
  submitted:           'sky',
  verification_pending:'risk',
  verified_removed:    'safe',
  re_listed:           'critical',
  failed:              'risk',
  requires_manual:     'risk',
}

const statusLabel: Record<string, string> = {
  pending:             'Awaiting submission',
  submitted:           'Submitted to broker',
  verification_pending:'Broker verification',
  verified_removed:    '✓ Removed',
  re_listed:           '⚠️ Re-listed',
  failed:              '✕ Failed',
  requires_manual:     'Manual needed',
}

const methodLabel: Record<string, string> = {
  web_form: 'Automated form',
  email:    'Email request',
  manual:   'Manual (browser)',
}

// Timeline stages in order
const REMOVAL_STAGES = [
  { key: 'pending',            label: 'Queued',         icon: '○' },
  { key: 'submitted',          label: 'Submitted',      icon: '→' },
  { key: 'verification_pending',label: 'Broker reviews',  icon: '◷' },
  { key: 'verified_removed',   label: 'Removed',         icon: '✓' },
]

function RemovalTimeline({ status }: { status: string }) {
  const stageIndex = REMOVAL_STAGES.findIndex(s => s.key === status)
  const isReListed = status === 're_listed'
  const isFailed = status === 'failed' || status === 'requires_manual'

  if (isReListed || isFailed) {
    return (
      <span className={`text-xs font-medium ${isReListed ? 'text-red-600' : 'text-gray-500'}`}>
        {isReListed ? '⚠️ Re-listed — re-submit' : 'Manual action required'}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {REMOVAL_STAGES.map((stage, i) => {
        const done = i <= stageIndex
        const current = i === stageIndex
        return (
          <div key={stage.key} className="flex items-center gap-1">
            {i > 0 && (
              <div className={`w-4 h-px ${done ? 'bg-navy' : 'bg-gray-200'}`} />
            )}
            <div className={`flex items-center gap-1 text-xs ${done ? 'text-navy font-medium' : 'text-gray-400'}`}>
              <span>{current ? '●' : done ? '✓' : '○'}</span>
              <span className="hidden sm:inline">{stage.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const BROKER_Legal_HINTS: Record<string, string> = {
  spokeo:             'CCPA §1798.105 — must remove within 15 business days',
  whitepages:         'CCPA §1798.105 — must honor opt-out within 10 days',
  beenverified:       'FCRA §609.8 — you can dispute and request removal',
  intelius:           'CCPA §1798.105 — removal request must be honored',
  radaris:            'CCPA §1798.100 — right to delete personal information',
  peoplefinder:       'CCPA §1798.105 — removal must be processed within 15 days',
  instantcheckmate:   'FCRA §609.8 — right to dispute inaccurate data',
  mylife:             'CCPA §1798.105 — can request deletion of your profile',
}

export default function RemovalPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [items, setItems] = useState<RemovalQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

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
    pending:           items.filter(i => i.status === 'pending').length,
    in_progress:       items.filter(i => ['submitted', 'verification_pending'].includes(i.status)).length,
    verified_removed:  items.filter(i => i.status === 'verified_removed').length,
    re_listed:        items.filter(i => i.status === 're_listed').length,
    requires_manual:   items.filter(i => i.status === 'requires_manual').length,
  }

  const filteredItems = items.filter(i => {
    if (activeTab === 'pending')           return i.status === 'pending'
    if (activeTab === 'in_progress')        return ['submitted', 'verification_pending'].includes(i.status)
    if (activeTab === 'verified_removed')  return i.status === 'verified_removed'
    if (activeTab === 're_listed')         return i.status === 're_listed'
    if (activeTab === 'requires_manual')    return i.status === 'requires_manual'
    return false
  })

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
    high:   'bg-critical-light text-critical',
    medium: 'bg-risk-light text-risk',
    low:    'bg-gray-100 text-gray-600',
  }

  const totalRemoved = items.filter(i => i.status === 'verified_removed').length
  const totalPending = items.filter(i => i.status === 'pending').length

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-navy">Removal queue</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your opt-out requests and their current status.
          </p>
        </div>
        {/* Summary */}
        <div className="flex gap-4 text-sm">
          {totalRemoved > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-safe">{totalRemoved}</div>
              <div className="text-xs text-gray-500">Removed</div>
            </div>
          )}
          {totalPending > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{totalPending}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          )}
        </div>
      </div>

      {/* Legal rights strip */}
      <Card className="border border-blue/20 bg-blue/5">
        <div className="flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue mt-0.5 shrink-0">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div className="flex-1">
            <p className="text-xs font-semibold text-navy">
              Your legal rights — brokers must comply within 15-45 days
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Under CCPA (California), CDPA (Virginia), CPA (Colorado), and similar state privacy laws,
              you have the right to request removal of your personal data. We submit only your name
              and city to brokers — never your SSN, driver&apos;s license, or financial information,
              even when brokers request it.
            </p>
          </div>
        </div>
      </Card>

      {/* Tab navigation */}
      <div className="mt-6 flex items-center gap-1 border-b border-gray-100 overflow-x-auto">
        {tabConfig.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          filteredItems.map(item => {
            const legalHint = BROKER_Legal_HINTS[item.broker_id] || 'State privacy laws require broker to honor your removal request within 45 days.'
            return (
              <Card key={item.id} className="p-0 overflow-hidden">
                {/* Main row */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-navy">{item.broker_name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${priorityColors[item.priority] || 'bg-gray-100 text-gray-600'}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-400">
                        {methodLabel[item.opt_out_method || 'web_form']}
                      </span>
                      {item.estimated_removal_days && item.status !== 'verified_removed' && (
                        <span className="text-xs text-gray-400">
                          ~{item.estimated_removal_days} days to remove
                        </span>
                      )}
                    </div>

                    {/* Status timeline — always visible */}
                    <div className="mt-2">
                      <RemovalTimeline status={item.status} />
                    </div>

                    {/* Expanded detail */}
                    {expanded === item.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <div className="flex items-start gap-2 text-xs">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue mt-0.5 shrink-0">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                          <p className="text-gray-600 leading-relaxed">{legalHint}</p>
                        </div>
                        {item.submitted_at && (
                          <p className="text-xs text-gray-400">
                            Submitted: {new Date(item.submitted_at).toLocaleDateString()}
                            {item.estimated_removal_days && (
                              <> · Expected removal by {new Date(new Date(item.submitted_at).getTime() + item.estimated_removal_days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                              </>
                            )}
                          </p>
                        )}
                        {(item as any).verified_at && (
                          <p className="text-xs text-safe font-medium">
                            ✓ Verified removed on {new Date((item as any).verified_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <Badge variant={statusBadgeVariant[item.status] || 'default'}>
                      {statusLabel[item.status] || item.status}
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
                    <button
                      onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                      className="text-xs text-gray-400 hover:text-navy transition-colors"
                    >
                      {expanded === item.id ? '▲ Less' : '▼ Details'}
                    </button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
