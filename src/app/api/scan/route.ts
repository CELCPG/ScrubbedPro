import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit'

/**
 * GET /api/scan — list the user's scan history.
 */
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      broker_results(*),
      persons(first_name, last_name, current_city, current_state)
    `)
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * POST /api/scan — trigger a new scan.
 * Body: { person_id?: string } — uses primary person if not provided.
 */
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))

  // Get the primary person record
  const personQuery = body.person_id
    ? supabase.from('persons').select('*').eq('id', body.person_id).eq('user_id', user.id).single()
    : supabase.from('persons').select('*').eq('user_id', user.id).eq('is_primary', true).single()

  const { data: person, error: personError } = await personQuery

  if (personError || !person) {
    return NextResponse.json({ error: 'Person not found' }, { status: 404 })
  }

  // Create a new scan record — initialize retry_count to 0
  const { data: scan, error: scanError } = await supabase
    .from('scans')
    .insert({
      person_id: person.id,
      user_id: user.id,
      status: 'queued',
      started_at: new Date().toISOString(),
      retry_count: 0,
    })
    .select()
    .single()

  if (scanError) {
    logger.error({ err: scanError, user_id: user.id }, 'failed to create scan record')
    return NextResponse.json({ error: scanError.message }, { status: 500 })
  }

  await audit({
    userId: user.id,
    event: 'scan.started',
    resource: 'scans',
    resourceId: scan.id,
    diff: { person_id: person.id },
  })

  return NextResponse.json({ scan_id: scan.id, status: 'queued' }, { status: 202 })
}