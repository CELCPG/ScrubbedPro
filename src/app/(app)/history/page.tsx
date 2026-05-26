'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import type { Scan } from '@/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

export default function HistoryPage() {
  const router = useRouter()
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      supabase
        .from('scans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('started_at', { ascending: false })
        .then(({ data }) => {
          setScans(data || [])
          setLoading(false)
        })
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const completed = scans.filter(s => s.status === 'completed')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium tracking-tight text-navy">Scan history</h1>
      <p className="mt-1 text-sm text-gray-500">
        {completed.length} completed scan{completed.length !== 1 ? 's' : ''}
      </p>

      {completed.length === 0 ? (
        <Card className="mt-6 text-center py-8">
          <p className="text-sm text-gray-500">No completed scans yet.</p>
          <button onClick={() => router.push('/scan')} className="mt-3 text-sm text-navy hover:underline">
            Run your first scan →
          </button>
        </Card>
      ) : (
        <div className="mt-6 space-y-3">
          {completed.map(scan => (
            <Card key={scan.id} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-navy">{formatRelativeTime(scan.started_at)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    scan.risk_tier === 'CRITICAL' ? 'bg-critical-light text-critical' :
                    scan.risk_tier === 'HIGH' ? 'bg-risk-light text-risk' :
                    scan.risk_tier === 'MEDIUM' ? 'bg-amber-50 text-amber-700' :
                    'bg-safe-light text-safe'
                  }`}>
                    {scan.risk_tier}
                  </span>
                  <span className="text-sm text-gray-500">
                    Score: {scan.exposure_score}/100
                  </span>
                </div>
                <div className="mt-1.5 flex gap-4 text-xs text-gray-400">
                  <span>{scan.brokers_with_listings} listings found</span>
                  <span>{scan.brokers_blocked} blocked</span>
                  {scan.scan_duration_seconds && (
                    <span>{Math.floor(scan.scan_duration_seconds / 60)}m {scan.scan_duration_seconds % 60}s</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push(`/brokers?scan=${scan.id}`)}
                className="text-sm text-navy hover:underline"
              >
                View results →
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}