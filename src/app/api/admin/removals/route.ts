import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/removals — all removal queue items across all users.
 * Query params: status, broker_id, page, limit
 */
export async function GET(request: Request) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status') || ''
  const brokerId = searchParams.get('broker_id') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '50', 10))
  const offset = (page - 1) * limit

  let query = supabase
    .from('removal_queue')
    .select(`
      id,
      status,
      priority,
      opt_out_method,
      estimated_removal_days,
      submitted_at,
      verified_at,
      created_at,
      broker_id,
      broker_name,
      scan_id,
      user_id
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }
  if (brokerId) {
    query = query.eq('broker_id', brokerId)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    removals: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

/**
 * POST /api/admin/removals — retry a failed removal request.
 * Body: { id: string }
 */
export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json().catch(() => ({}))

  const { id } = body
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Reset status to pending for retry
  const { error } = await supabase
    .from('removal_queue')
    .update({ status: 'pending', submitted_at: null, verified_at: null })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
