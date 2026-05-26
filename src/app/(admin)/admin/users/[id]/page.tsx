'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

type UserDetail = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  current_city: string
  current_state: string
  phone_numbers: string[]
  email_addresses: string[]
  created_at: string
  updated_at: string
  email: string | null
  auth_created_at: string | null
  plan: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
  current_period_end: string | null
  scans: Array<{
    id: string
    status: string
    exposure_score: number | null
    risk_tier: string | null
    brokers_with_listings: number
    started_at: string | null
    completed_at: string | null
  }>
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: 'bg-red-900 text-red-300',
  HIGH: 'bg-orange-900 text-orange-300',
  MEDIUM: 'bg-yellow-900 text-yellow-300',
  LOW: 'bg-green-900 text-green-300',
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [triggeringScan, setTriggeringScan] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [id])

  const triggerScan = async () => {
    if (!user) return
    setTriggeringScan(true)
    try {
      const res = await fetch('/api/admin/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person_id: user.id, user_id: user.user_id }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/admin/scans/${data.scan.id}`)
      }
    } finally {
      setTriggeringScan(false)
    }
  }

  if (loading) {
    return <div className="text-gray-500">Loading...</div>
  }

  if (!user) {
    return <div className="text-gray-500">User not found</div>
  }

  const planColors: Record<string, string> = {
    individual: 'bg-blue-900 text-blue-300',
    family: 'bg-purple-900 text-purple-300',
    small_biz: 'bg-amber-900 text-amber-300',
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-900 text-green-300',
    canceled: 'bg-red-900 text-red-300',
    past_due: 'bg-yellow-900 text-yellow-300',
    trialing: 'bg-blue-900 text-blue-300',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-white mb-2">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-400 mt-1">{user.email || 'No email'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" onClick={triggerScan} disabled={triggeringScan}>
            {triggeringScan ? 'Triggering...' : 'Run Scan'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Location</dt>
              <dd className="text-white">
                {user.current_city !== 'Not Set' ? `${user.current_city}, ${user.current_state}` : user.current_state}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone Numbers</dt>
              <dd className="text-white">
                {user.phone_numbers.length > 0 ? user.phone_numbers.join(', ') : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Emails</dt>
              <dd className="text-white">
                {user.email_addresses.length > 0 ? user.email_addresses.join(', ') : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Member Since</dt>
              <dd className="text-white">
                {user.auth_created_at ? new Date(user.auth_created_at).toLocaleDateString() : '—'}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Subscription info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Subscription</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Plan</dt>
              <dd>
                {user.plan ? (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${planColors[user.plan] || 'bg-gray-700 text-gray-300'}`}>
                    {user.plan}
                  </span>
                ) : (
                  <span className="text-gray-600">No active plan</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd>
                {user.subscription_status ? (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${statusColors[user.subscription_status] || 'bg-gray-700 text-gray-300'}`}>
                    {user.subscription_status}
                  </span>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Period End</dt>
              <dd className="text-white">
                {user.current_period_end ? new Date(user.current_period_end).toLocaleDateString() : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Stripe Customer</dt>
              <dd className="text-white font-mono text-sm">
                {user.stripe_customer_id || '—'}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Activity</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500">Total Scans</dt>
              <dd className="text-3xl font-bold text-white">{user.scans.length}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Last Scan</dt>
              <dd className="text-white">
                {user.scans[0]?.started_at
                  ? new Date(user.scans[0].started_at).toLocaleDateString()
                  : 'Never'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Highest Exposure</dt>
              <dd className="text-white">
                {user.scans.reduce((max, s) => Math.max(max, s.exposure_score || 0), 0) || '—'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Scan history */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Scan History</h2>
        <Card className="overflow-hidden">
          {user.scans.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No scans yet</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800 text-left">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Score</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Risk</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Findings</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {user.scans.map(scan => (
                  <tr key={scan.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {scan.started_at ? new Date(scan.started_at).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={scan.status === 'completed' ? 'default' : scan.status === 'failed' ? 'critical' : 'default'}>
                        {scan.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white font-mono">
                      {scan.exposure_score ?? '—'}
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
                          <span className="text-white">{scan.brokers_with_listings}</span> brokers
                        </span>
                      ) : (
                        '—'
                      )}
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
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  )
}
