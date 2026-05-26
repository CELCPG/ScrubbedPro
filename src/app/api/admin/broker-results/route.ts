import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const scan_id = searchParams.get('scan_id')
  const person_id = searchParams.get('person_id')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = (page - 1) * limit

  let query = supabase
    .from('broker_results')
    .select(`
      id,
      broker_id,
      broker_name,
      status,
      listing_url,
      match_confidence,
      fields_exposed,
      priority,
      robocall_risk,
      scraped_at,
      persons (
        id,
        user_id,
        first_name,
        last_name
      )
    `, { count: 'exact' })
    .order('scraped_at', { ascending: false })

  if (scan_id) {
    query = query.eq('scan_id', scan_id)
  }
  if (person_id) {
    query = query.eq('person_id', person_id)
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get user emails
  const userIds = Array.from(new Set((data || []).map(r => (r as any).persons?.user_id).filter(Boolean))) as string[]
  let userEmails: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    userEmails = (authUsers?.users || [])
      .filter(u => userIds.includes(u.id))
      .reduce((acc, u) => ({ ...acc, [u.id]: u.email }), {})
  }

  const enriched = (data || []).map(r => ({
    ...r,
    user_email: userEmails[(r as any).persons?.user_id] || null,
  }))

  return NextResponse.json({
    results: enriched,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
}
