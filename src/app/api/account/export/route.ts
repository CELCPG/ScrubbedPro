import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

/**
 * GET /api/account/export — export all of the authenticated user's data
 * as a JSON file.
 *
 * Returns: { version, export_date, user_id, email, data: { persons, scans, broker_results, removal_queue } }
 */
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  try {
    // Fetch all user data in parallel
    const [personsResult, scansResult, subscriptionsResult] = await Promise.all([
      supabase.from('persons').select('*').eq('user_id', userId),
      supabase.from('scans').select('*').eq('user_id', userId),
      supabase.from('subscriptions').select('*').eq('user_id', userId),
    ])

    // Fetch broker_results via scan IDs
    let brokerResults: unknown[] = []
    let removalQueue: unknown[] = []

    if (scansResult.data && scansResult.data.length > 0) {
      const scanIds = scansResult.data.map((s: { id: string }) => s.id)
      const [brResult, rqResult] = await Promise.all([
        supabase.from('broker_results').select('*').in('scan_id', scanIds),
        supabase.from('removal_queue').select('*').eq('user_id', userId),
      ])
      brokerResults = brResult.data ?? []
      removalQueue = rqResult.data ?? []
    }

    const exportData = {
      version: '1.0',
      export_date: new Date().toISOString(),
      user_id: userId,
      email: user.email,
      data: {
        persons: personsResult.data ?? [],
        scans: scansResult.data ?? [],
        broker_results: brokerResults,
        removal_queue: removalQueue,
        subscriptions: subscriptionsResult.data ?? [],
      },
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="scrubbed-pro-export-${userId}.json"`,
        'Content-Type': 'application/json',
      },
    })

  } catch (err) {
    logger.error({ err, user_id: userId }, 'Account data export failed')
    return NextResponse.json({ error: 'Failed to export account data' }, { status: 500 })
  }
}