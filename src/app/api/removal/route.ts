import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit'

/**
 * POST /api/removal — add a broker result to the removal queue.
 * Body: { broker_result_id: string }
 */
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { broker_result_id } = body

  // Fetch the broker result to get broker metadata
  const { data: brokerResult, error: brError } = await supabase
    .from('broker_results')
    .select('*')
    .eq('id', broker_result_id)
    .eq('user_id', user.id)
    .single()

  if (brError || !brokerResult) {
    return NextResponse.json({ error: 'Broker result not found' }, { status: 404 })
  }

  // Check if already in queue
  const { data: existing } = await supabase
    .from('removal_queue')
    .select('id')
    .eq('broker_result_id', broker_result_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Already in removal queue' }, { status: 409 })
  }

  // Insert into removal queue
  const { data: item, error: insertError } = await supabase
    .from('removal_queue')
    .insert({
      person_id: brokerResult.person_id,
      user_id: user.id,
      broker_result_id,
      broker_id: brokerResult.broker_id,
      broker_name: brokerResult.broker_name,
      status: 'pending',
      priority: brokerResult.priority,
      robocall_risk: brokerResult.robocall_risk,
      // opt_out_url, opt_out_method etc. will come from broker_config in Phase 3
    })
    .select()
    .single()

  if (insertError) {
    logger.error({ err: insertError, user_id: user.id, broker_result_id }, 'failed to insert into removal queue')
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  await audit({
    userId: user.id,
    event: 'removal.submitted',
    resource: 'removal_queue',
    resourceId: item.id,
    diff: { broker_name: brokerResult.broker_name, priority: brokerResult.priority },
  })

  return NextResponse.json(item, { status: 201 })
}