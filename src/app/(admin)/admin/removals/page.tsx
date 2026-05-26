'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

type RemovalItem = {
  id: string
  status: string
  priority: string | null
  opt_out_method: string | null
  estimated_removal_days: number | null
  submitted_at: string | null
  verified_at: string | null
  created_at: string
  broker_id: string
  broker_name: string
  scan_id: string
  user_id: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'critical' | 'risk' | 'safe' }> = {
  pending:     { label: 'Pending',     variant: 'default' },
  submitted:  { label: 'Submitted',   variant: 'risk'    },
  verified_removed: { label: 'Verified Removed', variant: 'safe'  },
  failed:     { label: 'Failed',      variant: 'critical' },
  requires_manual: { label: 'Manual', variant: 'default' },
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   'bg-red-900 text-red-300',
  medium: 'bg-yellow-900 text-yellow-300',
  low:    'bg-gray-700 text-gray-300',
}

const METHOD_LABELS: Record<string, string> = {
  web_form: 'Web Form',
  email: 'Email',
  mail: 'Mail',
  manual: 'Manual',
}

export default function AdminRemovalsPage() {
  const [removals, setRemovals] = useState<RemovalItem[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [retrying, setRetrying] = useState<string | null>(null)

  const fetchRemovals = useCallback(async (page = 1, status = statusFilter) => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: '50',
      ...(status && { status }),
    })
    const res = await fetch(`/api/admin/removals?${params}`)
    const data = await res.json()
    setRemovals(data.removals || [])
    setPagination(data.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 })
    setLoading(false)
  }, [statusFilter])

  useEffect(() => {
    fetchRemovals()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const retryRemoval = async (id: string) => {
    setRetrying(id)
    try {
      const res = await fetch('/api/admin/removals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setRemovals(removals.map(r => r.id === id ? { ...r, status: 'pending', submitted_at: null, verified_at: null } : r))
      }
    } finally {
      setRetrying(null)
    }
  }

  const statusCounts = removals.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Removal Queue</h1>
        <p className="text-gray-400 mt-1">All opt-out requests across all users</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = statusFilter === status
            ? removals.length
            : removals.filter(r => r.status === status).length
          return (
            <Card key={status} className="p-4 cursor-pointer transition-colors"
              onClick={() => {
                const newStatus = statusFilter === status ? '' : status
                setStatusFilter(newStatus)
                fetchRemovals(1, newStatus)
              }}>
              <p className="text-sm text-gray-400 capitalize">{cfg.label}</p>
              <p className={`text-2xl font-bold mt-1 ${
                status === 'verified_removed' ? 'text-green-400' :
                status === 'failed' ? 'text-red-400' :
                status === 'submitted' ? 'text-yellow-400' : 'text-white'
              }`}>{count}</p>
            </Card>
          )
        })}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'submitted', 'verified_removed', 'failed', 'requires_manual'].map(status => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); fetchRemovals(1, status) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {status === '' ? 'All' : STATUS_CONFIG[status]?.label || status}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Broker</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Priority</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Method</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Est. Days</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Submitted</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Verified</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Created</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <Spinner size="md" className="mx-auto" />
                  </td>
                </tr>
              ) : removals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No removal requests found</td>
                </tr>
              ) : (
                removals.map(removal => {
                  const cfg = STATUS_CONFIG[removal.status] || STATUS_CONFIG.pending
                  return (
                    <tr key={removal.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white font-medium">{removal.broker_name}</p>
                        <p className="text-xs text-gray-500 font-mono">{removal.broker_id}</p>
                      </td>
                      <td className="px-4 py-3">
                        {removal.priority && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[removal.priority] || 'bg-gray-700 text-gray-300'}`}>
                            {removal.priority}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {METHOD_LABELS[removal.opt_out_method || ''] || removal.opt_out_method || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {removal.estimated_removal_days ? `~${removal.estimated_removal_days}d` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {removal.submitted_at
                          ? new Date(removal.submitted_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {removal.verified_at
                          ? new Date(removal.verified_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {new Date(removal.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {(removal.status === 'failed' || removal.status === 'requires_manual') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryRemoval(removal.id)}
                            disabled={retrying === removal.id}
                          >
                            {retrying === removal.id ? 'Retrying…' : 'Retry'}
                          </Button>
                        )}
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
                onClick={() => fetchRemovals(pagination.page - 1, statusFilter)}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchRemovals(pagination.page + 1, statusFilter)}
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
