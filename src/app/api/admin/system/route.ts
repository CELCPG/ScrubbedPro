import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/system — system health and scanner metrics.
 */
export async function GET() {
  const supabase = createAdminClient()

  // Fire all queries in parallel
  const [
    totalScansRes,
    completedScansRes,
    failedScansRes,
    runningScansRes,
    queuedScansRes,
    totalUsersRes,
    totalRemovalsRes,
    pendingRemovalsRes,
    verifiedRemovalsRes,
    failedRemovalsRes,
    recentScansRes,
    brokerErrorsRes,
    avgDurRes,
    recentScansAllRes,
  ] = await Promise.all([
    supabase.from('scans').select('id', { count: 'exact', head: true }),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('status', 'running'),
    supabase.from('scans').select('id', { count: 'exact', head: true }).eq('status', 'queued'),
    supabase.from('persons').select('id', { count: 'exact', head: true }),
    supabase.from('removal_queue').select('id', { count: 'exact', head: true }),
    supabase.from('removal_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('removal_queue').select('id', { count: 'exact', head: true }).eq('status', 'verified_removed'),
    supabase.from('removal_queue').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('scans').select('id, status').eq('status', 'failed').order('started_at', { ascending: false }).limit(20),
    supabase.from('broker_results').select('broker_id, broker_name, status').eq('status', 'error').order('scraped_at', { ascending: false }).limit(50),
    supabase.from('scans').select('scan_duration_seconds').eq('status', 'completed').not('scan_duration_seconds', 'is', null).order('started_at', { ascending: false }).limit(100),
    supabase.from('scans').select('id, status').gte('started_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  // Success rate (last 30 days)
  const recentScansAll = recentScansAllRes.data || []
  const totalRecent = recentScansAll.length
  const completedRecent = recentScansAll.filter(s => s.status === 'completed').length
  const successRate = totalRecent > 0 ? Math.round((completedRecent / totalRecent) * 100) : 0

  // Average scan duration
  const durations = (avgDurRes.data || []).map(d => d.scan_duration_seconds).filter(Boolean) as number[]
  const avgDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null

  // Broker errors from failed scans
  const brokerErrorsData = brokerErrorsRes.data || []
  const recentFailuresData = recentScansRes.data || []

  return NextResponse.json({
    scans: {
      total: totalScansRes.count || 0,
      completed: completedScansRes.count || 0,
      failed: failedScansRes.count || 0,
      running: runningScansRes.count || 0,
      queued: queuedScansRes.count || 0,
      successRate,
      avgDurationSeconds: avgDuration,
    },
    users: {
      total: totalUsersRes.count || 0,
    },
    removals: {
      total: totalRemovalsRes.count || 0,
      pending: pendingRemovalsRes.count || 0,
      verified: verifiedRemovalsRes.count || 0,
      failed: failedRemovalsRes.count || 0,
    },
    recentFailures: recentFailuresData.length,
    brokerErrors: brokerErrorsData,
    scannerHealth: {
      status: 'configured',
      note: 'Scanner health requires SCANNER_API_URL to be set and scanner deployed.',
    },
  })
}
