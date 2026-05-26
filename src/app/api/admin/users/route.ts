import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const plan = searchParams.get('plan') || ''
  const status = searchParams.get('status') || ''
  const offset = (page - 1) * limit

  // Build query for users + subscriptions
  let query = supabase
    .from('persons')
    .select(`
      id,
      user_id,
      first_name,
      last_name,
      current_city,
      current_state,
      created_at,
      updated_at,
      subscriptions (
        id,
        plan,
        status,
        stripe_customer_id,
        current_period_end,
        cancel_at_period_end
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }

  const { data: persons, error, count } = await query.range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Also get auth.users info (email) for each user
  const userIds = persons?.map(p => p.user_id).filter(Boolean) || []
  let userEmails: Record<string, string> = {}

  if (userIds.length > 0) {
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    userEmails = (authUsers?.users || [])
      .filter(u => userIds.includes(u.id))
      .reduce((acc, u) => ({ ...acc, [u.id]: u.email }), {})
  }

  const users = (persons || []).map(p => ({
    ...p,
    email: userEmails[p.user_id] || null,
    plan: (p as any).subscriptions?.plan || null,
    subscription_status: (p as any).subscriptions?.status || null,
    stripe_customer_id: (p as any).subscriptions?.stripe_customer_id || null,
    current_period_end: (p as any).subscriptions?.current_period_end || null,
    cancel_at_period_end: (p as any).subscriptions?.cancel_at_period_end || false,
  }))

  // Filter by plan/status if specified
  let filtered = users
  if (plan) filtered = filtered.filter(u => u.plan === plan)
  if (status) filtered = filtered.filter(u => u.subscription_status === status)

  return NextResponse.json({
    users: filtered,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  })
}
