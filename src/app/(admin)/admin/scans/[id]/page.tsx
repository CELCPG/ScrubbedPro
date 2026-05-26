'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type ScanDetail = {
  id: string
  status: string
  exposure_score: number | null
  risk_tier: string | null
  total_brokers_scanned: number
  brokers_with_listings: number
  fields_most_exposed: string[]
  started_at: string | null
  completed_at: string | null
  scan_duration_seconds: number | null
  user_email: string | null
  persons: {
    id: string
    user_id: string
    first_name: string
    last_name: string
    current_city: string
    current_state: string
  } | null
  broker_results: Array<{
    id: string
    broker_id: string
    broker_name: string
    status: string
    listing_url: string | null
    match_confidence: number | null
    fields_exposed: string[]
    priority: string | null
    robocall_risk: boolean
    scraped_at: string | null
  }>
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-900 text-red-300',
  HIGH: 'bg-orange-900 text-orange-300',
  MEDIUM: 'bg-yellow-900 text-yellow-300',
  LOW: 'bg-green-900 text-green-300',
}

const BROKER_STATUS_COLORS: Record<string, string> = {
  found: 'bg-red-900 text-red-300',
  not_found: 'bg-green-900 text-green-300',
  blocked: 'bg-blue-900 text-blue-300',
  error: 'bg-gray-700 text-gray-300',
}

export default function ScanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [scan, setScan] = useState<ScanDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/scans/${id}`)
      .then(r => r.json())
      .then(data => {
        setScan(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="text-gray-500">Loading...</div>
  }

  if (!scan) {
    return <div className="text-gray-500">Scan not found</div>
  }

  const foundResults = scan.broker_results.filter(r => r.status === 'found')
  const notFoundResults = scan.broker_results.filter(r => r.status === 'not_found')
  const blockedResults = scan.broker_results.filter(r => r.status === 'blocked')
  const errorResults = scan.broker_results.filter(r => r.status === 'error')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-white mb-2">
          ← Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Scan Details</h1>
            <p className="text-gray-400 mt-1">
              {scan.persons ? `${scan.persons.first_name} ${scan.persons.last_name}` : 'Unknown'} • {scan.user_email || '—'}
            </p>
          </div>
          <Badge variant={scan.status === 'completed' ? 'default' : scan.status === 'failed' ? 'critical' : 'default'}>
            {scan.status}
          </Badge>
        </div>
      </div>

      {/* Scan stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-400">Exposure Score</p>
          <p className="text-3xl font-bold text-white mt-1">{scan.exposure_score ?? '—'}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Risk Tier</p>
          <p className="mt-1">
            {scan.risk_tier ? (
              <span className={`px-3 py-1 rounded text-sm font-medium ${RISK_COLORS[scan.risk_tier] || 'bg-gray-700 text-gray-300'}`}>
                {scan.risk_tier}
              </span>
            ) : (
              <span className="text-gray-600">—</span>
            )}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Brokers Scanned</p>
          <p className="text-3xl font-bold text-white mt-1">{scan.total_brokers_scanned}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Listings Found</p>
          <p className="text-3xl font-bold text-red-400 mt-1">{scan.brokers_with_listings}</p>
        </Card>
      </div>

      {/* Timing info */}
      <Card className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Started</p>
            <p className="text-white mt-1">
              {scan.started_at ? new Date(scan.started_at).toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-white mt-1">
              {scan.completed_at ? new Date(scan.completed_at).toLocaleString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-white mt-1">
              {scan.scan_duration_seconds ? `${Math.round(scan.scan_duration_seconds)}s` : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Started at</p>
            <p className="text-white mt-1">
              {scan.started_at ? new Date(scan.started_at).toLocaleTimeString() : '—'}
            </p>
          </div>
        </div>
      </Card>

      {/* Broker results breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-400">Found</p>
          <p className="text-2xl font-bold text-red-400">{foundResults.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-400">Not Found</p>
          <p className="text-2xl font-bold text-green-400">{notFoundResults.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-400">Blocked</p>
          <p className="text-2xl font-bold text-blue-400">{blockedResults.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-400">Errors</p>
          <p className="text-2xl font-bold text-gray-400">{errorResults.length}</p>
        </Card>
      </div>

      {/* Most exposed fields */}
      {scan.fields_most_exposed.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Most Exposed Data Fields</h2>
          <div className="flex flex-wrap gap-2">
            {scan.fields_most_exposed.map((field, i) => (
              <span key={i} className="px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">
                {field}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Broker results table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Broker Results</h2>
        <Card className="overflow-hidden">
          {scan.broker_results.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No results</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Broker</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Confidence</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Priority</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Robocall Risk</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Fields Exposed</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-400">Listing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {scan.broker_results.map(result => (
                    <tr key={result.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{result.broker_name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${BROKER_STATUS_COLORS[result.status] || 'bg-gray-700 text-gray-300'}`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {result.match_confidence != null ? `${Math.round(result.match_confidence * 100)}%` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {result.priority && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            result.priority === 'high' ? 'bg-red-900 text-red-300' :
                            result.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {result.priority}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {result.robocall_risk ? (
                          <span className="text-red-400 text-sm">⚠️ Yes</span>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {result.fields_exposed.slice(0, 3).map((field, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                              {field}
                            </span>
                          ))}
                          {result.fields_exposed.length > 3 && (
                            <span className="text-gray-500 text-xs">+{result.fields_exposed.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {result.listing_url ? (
                          <a
                            href={result.listing_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            View →
                          </a>
                        ) : (
                          <span className="text-gray-600 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
