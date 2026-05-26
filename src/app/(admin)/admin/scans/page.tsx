'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type Scan = {
  id: string
  status: string
  exposure_score: number | null
  risk_tier: string | null
  total_brokers_scanned: number
  brokers_with_listings: number
  started_at: string | null
  completed_at: string | null
  user_email: string | null
  persons: {
    id: string
    user_id: string
    first_name: string
    last_name: string
    current_city: string
    current_state: string
  } | null
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'risk' | 'critical' }> = {
  queued: { label: 'Queued', variant: 'default' },
  running: { label: 'Running', variant: 'risk' },
  completed: { label: 'Completed', variant: 'default' },
  failed: { label: 'Failed', variant: 'critical' },
  canceled: { label: 'Canceled', variant: 'critical' },
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-900 text-red-300',
  HIGH: 'bg-orange-900 text-orange-300',
  MEDIUM: 'bg-yellow-900 text-yellow-300',
  LOW: 'bg-green-900 text-green-300',
}

export default function AdminScansPage() {
  const router = useRouter()
  const [scans, setScans] = useState<Scan[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchScans = useCallback(async (page = 1, status = statusFilter) => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(status && { status }),
    })

    const res = await fetch(`/api/admin/scans?${params}`)
    const data = await res.json()
    setScans(data.scans || [])
    setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    fetchScans()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scan Queue</h1>
        <p className="text-gray-400 mt-1">Monitor all scan requests</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['', 'queued', 'running', 'completed', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); fetchScans(1, status) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Scans list */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">User</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Score</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Risk</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Brokers</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Started</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No scans found</td>
                </tr>
              ) : (
                scans.map(scan => {
                  const statusCfg = STATUS_CONFIG[scan.status] || STATUS_CONFIG.queued
                  return (
                    <tr key={scan.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">
                          {scan.persons ? `${scan.persons.first_name} ${scan.persons.last_name}` : 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">{scan.user_email || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {scan.exposure_score != null ? (
                          <span className="text-white font-mono">{scan.exposure_score}</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {scan.risk_tier ? (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${RISK_COLORS[scan.risk_tier] || 'bg-gray-700 text-gray-300'}`}>
                            {scan.risk_tier}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {scan.brokers_with_listings > 0 ? (
                          <span>
                            <span className="text-white">{scan.brokers_with_listings}</span>
                            <span className="text-gray-500">/{scan.total_brokers_scanned}</span>
                          </span>
                        ) : (
                          <span className="text-gray-600">{scan.total_brokers_scanned || 0}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {scan.started_at ? new Date(scan.started_at).toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/scans/${scan.id}`)}
                        >
                          View →
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => fetchScans(pagination.page - 1, statusFilter)}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchScans(pagination.page + 1, statusFilter)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
