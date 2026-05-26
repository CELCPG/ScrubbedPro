import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: person, error } = await supabase
    .from('persons')
    .select(`
      *,
      subscriptions (*),
      scans (
        id,
        status,
        exposure_score,
        risk_tier,
        total_brokers_scanned,
        brokers_with_listings,
        started_at,
        completed_at
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !person) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Get auth info (email)
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const authUser = authUsers?.users.find(u => u.id === person.user_id)

  return NextResponse.json({
    ...person,
    email: authUser?.email || null,
    auth_created_at: authUser?.created_at || null,
  })
}
