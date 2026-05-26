import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * POST /api/webhooks/scanner — receives broker scan results from the Python scanner.
 * Verifies shared secret in X-Scanner-Secret header.
 */
export async function POST(request: Request) {
  const headersList = await import('next/headers').then(h => h.headers())
  const secret = headersList.get('x-scanner-secret')

  if (secret !== process.env.SCANNER_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { scan_id, broker_id, status, result_data } = body

  if (!scan_id || !broker_id) {
    return NextResponse.json({ error: 'Missing scan_id or broker_id' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Upsert broker_result
  const { error: brError } = await supabase
    .from('broker_results')
    .upsert({
      scan_id,
      broker_id,
      status,
      listing_url: result_data?.listing_url || null,
      match_confidence: result_data?.match_confidence || null,
      fields_exposed: result_data?.fields_exposed || [],
      priority: result_data?.priority || 'medium',
      robocall_risk: result_data?.robocall_risk || false,
      raw_data: result_data?.raw_data || null,
    }, { onConflict: 'scan_id,broker_id' })

  if (brError) {
    logger.error({ err: brError, scan_id, broker_id }, 'Failed to upsert broker_result')
    return NextResponse.json({ error: 'Failed to write result' }, { status: 500 })
  }

  // Update scan counters
  if (status === 'found') {
    await supabase.rpc('increment_broker_found', { p_scan_id: scan_id })
  } else if (status === 'blocked') {
    await supabase.rpc('increment_broker_blocked', { p_scan_id: scan_id })
  }

  return NextResponse.json({ ok: true })
}