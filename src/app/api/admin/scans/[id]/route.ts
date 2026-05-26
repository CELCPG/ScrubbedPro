import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient as createClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data: scan, error } = await supabase
    .from('scans')
    .select(`
      *,
      persons (
        id,
        user_id,
        first_name,
        last_name,
        current_city,
        current_state
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
  }

  // Get user email
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const authUser = authUsers?.users.find(u => u.id === (scan as any).persons?.user_id)

  // Get broker results for this scan
  const { data: brokerResults } = await supabase
    .from('broker_results')
    .select('*')
    .eq('scan_id', params.id)
    .order('priority', { ascending: false })

  return NextResponse.json({
    ...scan,
    user_email: authUser?.email || null,
    broker_results: brokerResults || [],
  })
}
