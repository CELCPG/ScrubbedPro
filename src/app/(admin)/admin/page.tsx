import { createAdminClient as createClient } from '@/lib/supabase/admin'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

async function getStats() {
  const supabase = createClient()

  const [usersRes, scansRes, activeScansRes, removalRes] = await Promise.all([
    supabase.from('persons').select('id', { count: 'exact', head: true }),
    supabase.from('scans').select('id', { count: 'exact', head: true }),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('status', 'running'),
    supabase.from('removal_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ])

  return {
    totalUsers: usersRes.count || 0,
    totalScans: scansRes.count || 0,
    activeScans: activeScansRes.count || 0,
    pendingRemovals: removalRes.count || 0,
  }
}

async function getRecentScans() {
  const supabase = createClient()
  const { data } = await supabase
    .from('scans')
    .select(`
      id,
      status,
      exposure_score,
      risk_tier,
      started_at,
      persons (
        first_name,
        last_name
      )
    `)
    .order('started_at', { ascending: false })
    .limit(5)

  return data || []
}

export default async function AdminOverview() {
  const [stats, recentScans] = await Promise.all([getStats(), getRecentScans()])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">System overview and key metrics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Total Scans</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalScans.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Active Scans</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.activeScans}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-400">Pending Removals</p>
          <p className="text-3xl font-bold text-orange-400 mt-1">{stats.pendingRemovals}</p>
        </Card>
      </div>

      {/* Recent scans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Scans</h2>
          <a href="/admin/scans" className="text-sm text-blue-400 hover:text-blue-300">View all →</a>
        </div>
        <Card className="divide-y divide-gray-800">
          {recentScans.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No scans yet</p>
          ) : (
            recentScans.map((scan: any) => (
              <div key={scan.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-white font-medium">
                      {scan.persons?.first_name} {scan.persons?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {scan.started_at ? new Date(scan.started_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {scan.exposure_score != null && (
                    <span className="text-white font-mono">{scan.exposure_score}</span>
                  )}
                  <Badge variant={
                    scan.risk_tier === 'CRITICAL' ? 'critical' :
                    scan.risk_tier === 'HIGH' ? 'risk' :
                    scan.risk_tier === 'MEDIUM' ? 'default' : 'default'
                  }>
                    {scan.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}
