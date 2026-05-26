'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { ExposureScoreGauge } from '@/components/dashboard/ExposureScoreGauge'
import { ScoreHistoryChart } from '@/components/dashboard/ScoreHistoryChart'
import { BrokerResultCard } from '@/components/dashboard/BrokerResultCard'
import type { Scan, Person } from '@/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [scan, setScan] = useState<Scan | null>(null)
  const [person, setPerson] = useState<Person | null>(null)
  const [recentScans, setRecentScans] = useState<Scan[]>([])
  const [removedCount, setRemovedCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      loadDashboard(supabase, session.user.id)
    })
  }, [router])

  async function loadDashboard(supabase: ReturnType<typeof createClient>, userId: string) {
    // Get primary person
    const { data: p } = await supabase
      .from('persons')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single()

    if (p) setPerson(p)

    // Get most recent completed scan
    const { data: scans } = await supabase
      .from('scans')
      .select('*, broker_results(*)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(10)

    if (scans) {
      setRecentScans(scans)
      const latest = scans.find(s => s.status === 'completed')
      if (latest) setScan(latest)
    }

    // Count verified removals
    const { count: removed } = await supabase
      .from('removal_queue')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'verified_removed')
    if (removed !== null) setRemovedCount(removed)

    setLoading(false)
  }

  const handleRunScan = () => router.push('/scan')

  const brokerResults = (scan as any)?.broker_results || []
  const foundBrokers = brokerResults.filter((r: any) => r.status === 'found').slice(0, 8)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-navy">Your exposure</h1>
          <p className="mt-1 text-sm text-gray-500">
            {scan
              ? `Last scanned ${formatRelativeTime(scan.started_at)}`
              : 'No scans yet'}
          </p>
        </div>
        <Button onClick={handleRunScan}>
          Run new scan
        </Button>
      </div>

      {/* Exposure score hero */}
      <Card className="mb-6">
        <div className="flex items-center gap-8">
          <ExposureScoreGauge
            score={scan?.exposure_score ?? 0}
            riskTier={scan?.risk_tier ?? 'LOW'}
          />
          <div className="flex-1">
            {scan ? (
              <>
                <Badge variant={
                  scan.risk_tier === 'CRITICAL' ? 'critical' :
                  scan.risk_tier === 'HIGH' ? 'risk' :
                  scan.risk_tier === 'MEDIUM' ? 'default' : 'safe'
                } className="text-sm">
                  {scan.risk_tier} risk
                </Badge>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {scan.risk_tier === 'CRITICAL'
                    ? 'Your data is heavily exposed across dozens of broker sites. Immediate action is required.'
                    : scan.risk_tier === 'HIGH'
                    ? 'Your personal information is widely listed. We recommend starting removals immediately.'
                    : scan.risk_tier === 'MEDIUM'
                    ? 'Your data is moderately exposed. Removing high-priority listings will reduce your risk.'
                    : 'Your exposure is low. Keep monitoring to catch new listings.'}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Run your first scan to see your exposure score.
              </p>
            )}
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-medium text-navy">{brokerResults.length || '—'}</div>
              <div className="text-xs text-gray-500">Listings found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-navy">{scan?.brokers_blocked || 0}</div>
              <div className="text-xs text-gray-500">Brokers blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-medium text-safe">{removedCount}</div>
              <div className="text-xs text-gray-500">Verified removed</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Robocall risk alert */}
      {scan && scan.robocall_risk_brokers?.length > 0 && (
        <Card className="mb-6 border-l-4 border-risk bg-risk-light">
          <div className="flex items-start gap-4">
            <span className="text-2xl">📞</span>
            <div className="flex-1">
              <p className="font-medium text-risk">
                Your phone number is on {scan.robocall_risk_brokers.length} broker(s) that sell to robocallers.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Removing these first will reduce spam calls within 30-60 days.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {scan.robocall_risk_brokers.map((b: string) => (
                  <span key={b} className="rounded-full bg-white px-2 py-0.5 text-xs text-risk border border-risk/20">
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push('/removal')}>
              Prioritize these
            </Button>
          </div>
        </Card>
      )}

      {/* Stat bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Brokers scanned', value: scan?.total_brokers_scanned ?? '—' },
          { label: 'Listings found', value: brokerResults.filter((r: any) => r.status === 'found').length || '—' },
          { label: 'Pending removals', value: '—' },
          { label: 'Verified removed', value: removedCount },
        ].map((stat) => (
          <Card key={stat.label} className="text-center py-4">
            <div className="text-2xl font-medium text-navy">{stat.value}</div>
            <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Broker results */}
      {foundBrokers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-navy">Where your data is exposed</h2>
            <button onClick={() => router.push('/brokers')} className="text-sm text-navy hover:underline">
              View all results
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {foundBrokers.map((result: any) => (
              <BrokerResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}

      {/* Score history chart */}
      {recentScans.filter(s => s.status === 'completed').length >= 2 && (
        <Card>
          <h2 className="text-base font-medium text-navy mb-4">Score history</h2>
          <ScoreHistoryChart scans={recentScans.filter(s => s.status === 'completed')} />
        </Card>
      )}

      {recentScans.filter(s => s.status === 'completed').length === 1 && (
        <Card>
          <p className="text-sm text-gray-500 text-center py-4">
            Complete your second scan next month to see your score trend.
          </p>
        </Card>
      )}

      {/* No scans yet */}
      {!scan && (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-lg font-medium text-navy">No scans yet</h2>
          <p className="mt-2 text-sm text-gray-500 mb-6">
            Run your first scan to discover where your data is exposed.
          </p>
          {person && (person.first_name === 'Your Name' || !person.current_city) && (
            <div className="mb-6 rounded-lg bg-blue/5 border border-blue/20 px-4 py-3 text-sm text-navy">
              <strong>Set up your profile first</strong> so we know who to look for.
              <Button size="sm" variant="secondary" className="mt-2 ml-2" onClick={() => router.push('/profile')}>
                Complete profile →
              </Button>
            </div>
          )}
          <Button onClick={handleRunScan}>Start your first scan</Button>
        </Card>
      )}
    </div>
  )
}