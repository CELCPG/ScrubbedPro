'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import type { BrokerResult } from '@/types'

type FilterStatus = 'all' | 'found' | 'not_found' | 'blocked'
type FilterPriority = 'all' | 'high' | 'medium' | 'low'

export default function BrokersPage() {
  const router = useRouter()
  const [results, setResults] = useState<BrokerResult[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      supabase
        .from('broker_results')
        .select('*')
        .eq('user_id', session.user.id)
        .order('priority', { ascending: true })
        .then(({ data }) => {
          setResults(data || [])
          setLoading(false)
        })
    })
  }, [router])

  const filtered = results.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false
    return true
  })

  const statusColors: Record<string, string> = {
    found: 'bg-critical-light text-critical',
    not_found: 'bg-safe-light text-safe',
    blocked: 'bg-gray-100 text-gray-500',
    error: 'bg-risk-light text-risk',
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
      <h1 className="text-2xl font-medium tracking-tight text-navy">Broker results</h1>
      <p className="mt-1 text-sm text-gray-500">
        {results.length} results from your most recent scan
      </p>

      {/* Filters */}
      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Status:</span>
          {(['all', 'found', 'not_found', 'blocked'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Priority:</span>
          {(['all', 'high', 'medium', 'low'] as FilterPriority[]).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                priorityFilter === p
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Results list */}
      <div className="mt-6 space-y-2">
        {filtered.map(result => (
          <div key={result.id}>
            <div
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === result.id ? null : result.id)}
            >
              <div className="flex items-center gap-4">
                <span className="font-medium text-navy w-40">{result.broker_name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[result.status]}`}>
                  {result.status.replace('_', ' ')}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  result.priority === 'high' ? 'bg-critical-light text-critical' :
                  result.priority === 'medium' ? 'bg-risk-light text-risk' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {result.priority}
                </span>
                {result.robocall_risk && <span className="text-critical text-sm">📞</span>}
              </div>
              <div className="flex items-center gap-4">
                {result.match_confidence && (
                  <span className="text-xs text-gray-400">
                    {Math.round(result.match_confidence * 100)}% match
                  </span>
                )}
                <button className="text-gray-400 text-sm">
                  {expanded === result.id ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {expanded === result.id && (
              <div className="mt-1 rounded-xl border border-gray-100 bg-surface px-4 py-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Fields exposed:</span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {result.fields_exposed.map(f => (
                        <span key={f} className="rounded-full bg-sky px-2 py-0.5 text-xs text-navy">{f}</span>
                      ))}
                      {result.fields_exposed.length === 0 && <span className="text-gray-400">None</span>}
                    </div>
                  </div>
                  {result.listing_url && (
                    <div>
                      <span className="text-gray-500">Listing URL:</span>
                      <a href={result.listing_url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-blue hover:underline truncate">
                        {result.listing_url}
                      </a>
                    </div>
                  )}
                </div>
                {result.status === 'found' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/removal')
                    }}
                  >
                    Add to removal queue
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-8 text-gray-500 text-sm">
          No results match the selected filters.
        </Card>
      )}
    </div>
  )
}