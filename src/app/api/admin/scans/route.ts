import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') || ''
  const offset = (page - 1) * limit

  let query = supabase
    .from('scans')
    .select(`
      id,
      status,
      exposure_score,
      risk_tier,
      total_brokers_scanned,
      brokers_with_listings,
      started_at,
      completed_at,
      next_scan_at,
      persons (
        id,
        user_id,
        first_name,
        last_name,
        current_city,
        current_state
      )
    `, { count: 'exact' })
    .order('started_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data: scans, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get user emails
  const userIds = Array.from(new Set((scans || []).map(s => (s as any).persons?.user_id).filter(Boolean))) as string[]
  let userEmails: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    userEmails = (authUsers?.users || [])
      .filter(u => userIds.includes(u.id))
      .reduce((acc, u) => ({ ...acc, [u.id]: u.email }), {})
  }

  const enrichedScans = (scans || []).map(scan => ({
    ...scan,
    user_email: userEmails[(scan as any).persons?.user_id] || null,
  }))

  return NextResponse.json({
    scans: enrichedScans,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const body = await request.json()
  const { person_id, user_id } = body

  if (!person_id || !user_id) {
    return NextResponse.json({ error: 'person_id and user_id required' }, { status: 400 })
  }

  // Create a new scan
  const { data: scan, error } = await supabase
    .from('scans')
    .insert({
      person_id,
      user_id,
      status: 'queued',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scan }, { status: 201 })
}
