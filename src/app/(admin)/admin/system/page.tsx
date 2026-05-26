'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'

type SystemStats = {
  scans: {
    total: number
    completed: number
    failed: number
    running: number
    queued: number
    successRate: number
    avgDurationSeconds: number | null
  }
  users: { total: number }
  removals: {
    total: number
    pending: number
    verified: number
    failed: number
  }
  recentFailures: number
  brokerErrors: Array<{ broker_id: string; broker_name: string; status: string }>
  scannerHealth: { status: string; note: string }
}

export default function AdminSystemPage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStats = async () => {
    const res = await fetch('/api/admin/system')
    const data = await res.json()
    setStats(data)
    setLastRefresh(new Date())
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" />
      </div>
    )
  }

  const { scans, users, removals, scannerHealth, brokerErrors } = stats
  const failureRate = scans.total > 0 ? Math.round((scans.failed / scans.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
          <p className="text-gray-400 mt-1">Scanner performance, scan metrics, and error monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500">Last updated {lastRefresh.toLocaleTimeString()}</p>
          <button
            onClick={fetchStats}
            className="px-3 py-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg text-sm transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Scanner health */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Scanner Service</h2>
          <Badge variant={scannerHealth.status === 'operational' ? 'safe' : 'risk'}>
            {scannerHealth.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-400">{scannerHealth.note}</p>
      </Card>

      {/* Scan metrics */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Scan Performance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-400">Total Scans</p>
            <p className="text-3xl font-bold text-white mt-1">{scans.total.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Success Rate</p>
            <p className={`text-3xl font-bold mt-1 ${scans.successRate >= 80 ? 'text-green-400' : scans.successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {scans.successRate}%
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Failure Rate</p>
            <p className={`text-3xl font-bold mt-1 ${failureRate <= 5 ? 'text-green-400' : failureRate <= 20 ? 'text-yellow-400' : 'text-red-400'}`}>
              {failureRate}%
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Avg Duration</p>
            <p className="text-3xl font-bold text-white mt-1">
              {scans.avgDurationSeconds != null ? `${Math.round(scans.avgDurationSeconds)}s` : '—'}
            </p>
          </Card>
        </div>
      </div>

      {/* Scan status breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Completed', value: scans.completed, color: 'text-green-400' },
          { label: 'Running', value: scans.running, color: 'text-yellow-400' },
          { label: 'Queued', value: scans.queued, color: 'text-blue-400' },
          { label: 'Failed', value: scans.failed, color: 'text-red-400' },
          { label: 'Total Users', value: users.total, color: 'text-white' },
        ].map(stat => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {/* Removal metrics */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Removal Pipeline</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-400">Total Requests</p>
            <p className="text-3xl font-bold text-white mt-1">{removals.total.toLocaleString()}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{removals.pending}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Verified Removed</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{removals.verified}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-400">Failed</p>
            <p className="text-3xl font-bold text-red-400 mt-1">{removals.failed}</p>
          </Card>
        </div>
      </div>

      {/* Broker error breakdown */}
      {brokerErrors.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Recent Broker Errors</h2>
          <div className="space-y-2">
            {brokerErrors.slice(0, 10).map((err, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white font-medium">{err.broker_name || err.broker_id}</p>
                  <p className="text-xs text-gray-500 font-mono">{err.broker_id}</p>
                </div>
                <Badge variant="critical">{err.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/admin/scans?status=failed"
            className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg text-sm hover:bg-red-900 transition-colors"
          >
            View failed scans →
          </a>
          <a
            href="/admin/removals?status=failed"
            className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg text-sm hover:bg-red-900 transition-colors"
          >
            Retry failed removals →
          </a>
          <a
            href="/admin/scans?status=running"
            className="px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded-lg text-sm hover:bg-yellow-900 transition-colors"
          >
            Monitor running scans →
          </a>
        </div>
      </Card>
    </div>
  )
}
