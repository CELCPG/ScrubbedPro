'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type User = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  current_city: string
  current_state: string
  email: string | null
  plan: string | null
  subscription_status: string | null
  created_at: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchUsers = useCallback(async (page = 1, searchTerm = search, plan = planFilter, status = statusFilter) => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: '20',
      ...(searchTerm && { search: searchTerm }),
      ...(plan && { plan }),
      ...(status && { status }),
    })

    const res = await fetch(`/api/admin/users?${params}`)
    const data = await res.json()
    setUsers(data.users || [])
    setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    setLoading(false)
  }, [search, planFilter, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(1, search, planFilter, statusFilter)
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
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1">Manage all registered users</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <select
            value={planFilter}
            onChange={e => { setPlanFilter(e.target.value); fetchUsers(1, search, e.target.value, statusFilter) }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="">All Plans</option>
            <option value="individual">Individual</option>
            <option value="family">Family</option>
            <option value="small_biz">Small Biz</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); fetchUsers(1, search, planFilter, e.target.value) }}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="canceled">Canceled</option>
            <option value="past_due">Past Due</option>
            <option value="trialing">Trialing</option>
          </select>
          <Button type="submit" variant="primary">Search</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch('')
              setPlanFilter('')
              setStatusFilter('')
              fetchUsers(1, '', '', '')
            }}
          >
            Clear
          </Button>
        </form>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Email</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Location</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Plan</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Joined</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{user.first_name} {user.last_name}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{user.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {user.current_city !== 'Not Set' ? `${user.current_city}, ${user.current_state}` : user.current_state}
                    </td>
                    <td className="px-4 py-3">
                      {user.plan ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${planColors[user.plan] || 'bg-gray-700 text-gray-300'}`}>
                          {user.plan}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.subscription_status ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[user.subscription_status] || 'bg-gray-700 text-gray-300'}`}>
                          {user.subscription_status}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        View →
                      </Button>
                    </td>
                  </tr>
                ))
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
                onClick={() => fetchUsers(pagination.page - 1, search, planFilter, statusFilter)}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchUsers(pagination.page + 1, search, planFilter, statusFilter)}
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
