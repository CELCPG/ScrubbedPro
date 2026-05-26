import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit'

const MAX_SCAN_DURATION_SECONDS = 300 // 5 minutes — scans exceeding this are considered stuck
const MAX_RETRY_COUNT = 3

/**
 * GET /api/scan/[id] — fetch a specific scan with its broker results.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: scan, error } = await supabase
    .from('scans')
    .select(`
      *,
      broker_results(*),
      removal_queue(*)
    `)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
  }

  return NextResponse.json(scan)
}

/**
 * PATCH /api/scan/[id] — update scan status (cancel from frontend).
 * Body: { status: 'canceled' }
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data: scan, error } = await supabase
    .from('scans')
    .update({ status: body.status })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error || !scan) {
    return NextResponse.json({ error: 'Scan not found or update failed' }, { status: 404 })
  }

  return NextResponse.json(scan)
}

/**
 * POST /api/scan/[id] — scanner service calls this to report scan results.
 * Body: {
 *   status: 'completed' | 'failed',
 *   exposure_score?: number,
 *   risk_tier?: string,
 *   total_brokers_scanned?: number,
 *   brokers_with_listings?: number,
 *   brokers_blocked?: number,
 *   fields_most_exposed?: string[],
 *   robocall_risk_brokers?: string[],
 *   scan_duration_seconds?: number,
 *   report_json?: object,
 *   retry_count?: number,  // scanner passes incremented retry_count on retried calls
 * }
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const headersList = await headers()
  const secret = headersList.get('x-scanner-secret')
  const expected = process.env.SCANNER_WEBHOOK_SECRET

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const body = await request.json()

  // Fetch current scan to check retry_count
  const { data: currentScan, error: fetchError } = await supabase
    .from('scans')
    .select('id, retry_count, status')
    .eq('id', params.id)
    .single()

  if (fetchError || !currentScan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
  }

  // Enforce retry cap
  const incomingRetryCount = typeof body.retry_count === 'number' ? body.retry_count : (currentScan.retry_count ?? 0)
  if (incomingRetryCount >= MAX_RETRY_COUNT) {
    logger.warn({ scan_id: params.id, retry_count: incomingRetryCount }, 'scan retry cap exceeded, refusing to process')
    return NextResponse.json(
      { error: `Retry cap exceeded (${MAX_RETRY_COUNT}). Scan marked as failed.` },
      { status: 429 }
    )
  }

  const updateData: Record<string, unknown> = {
    status: body.status,
    retry_count: incomingRetryCount,
  }

  if (body.status === 'completed') {
    // Check scan duration for stuck scans
    if (typeof body.scan_duration_seconds === 'number' && body.scan_duration_seconds > MAX_SCAN_DURATION_SECONDS) {
      logger.warn(
        { scan_id: params.id, scan_duration_seconds: body.scan_duration_seconds },
        'scan exceeded max duration, marking as stuck/failed'
      )
      updateData.status = 'failed'
    }

    updateData.completed_at = new Date().toISOString()
    updateData.exposure_score = body.exposure_score ?? null
    updateData.risk_tier = body.risk_tier ?? null
    updateData.total_brokers_scanned = body.total_brokers_scanned ?? 0
    updateData.brokers_with_listings = body.brokers_with_listings ?? 0
    updateData.brokers_blocked = body.brokers_blocked ?? 0
    updateData.fields_most_exposed = body.fields_most_exposed ?? []
    updateData.robocall_risk_brokers = body.robocall_risk_brokers ?? []
    updateData.scan_duration_seconds = body.scan_duration_seconds ?? null
    updateData.report_json = body.report_json ?? null
    // Schedule next scan in 30 days
    updateData.next_scan_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  } else if (body.status === 'failed') {
    logger.error({ scan_id: params.id, scan_duration_seconds: body.scan_duration_seconds }, 'scan reported as failed by scanner service')
  }

  const { data: scan, error } = await supabase
    .from('scans')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error || !scan) {
    return NextResponse.json({ error: 'Scan not found or update failed' }, { status: 404 })
  }

  // Audit scan completion — look up user_id from the scan record itself
  if (body.status === 'completed') {
    const { data: scanRecord } = await supabase
      .from('scans')
      .select('user_id, exposure_score, brokers_with_listings')
      .eq('id', params.id)
      .single()

    if (scanRecord?.user_id) {
      await audit({
        userId: scanRecord.user_id,
        event: 'scan.completed',
        resource: 'scans',
        resourceId: params.id,
        diff: {
          exposure_score: body.exposure_score,
          risk_tier: body.risk_tier,
          brokers_with_listings: body.brokers_with_listings,
        },
      })
    }
  } else if (body.status === 'failed') {
    const { data: scanRecord } = await supabase
      .from('scans')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (scanRecord?.user_id) {
      await audit({
        userId: scanRecord.user_id,
        event: 'scan.failed',
        resource: 'scans',
        resourceId: params.id,
      })
    }
  }

  return NextResponse.json(scan)
}