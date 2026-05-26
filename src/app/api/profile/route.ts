import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { audit } from '@/lib/audit'

const MAX_STR = 200
const MAX_ARR = 25

function str(v: unknown, max = MAX_STR): string | null {
  if (v === undefined || v === null || v === '') return null
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length === 0 || t.length > max ? null : t
}

function strArr(v: unknown, max = MAX_ARR, itemMax = MAX_STR): string[] | null {
  if (v === undefined || v === null) return []
  if (!Array.isArray(v)) return null
  if (v.length > max) return null
  const out: string[] = []
  for (const item of v) {
    if (typeof item !== 'string') return null
    const t = item.trim()
    if (t.length === 0 || t.length > itemMax) return null
    out.push(t)
  }
  return out
}

function intInRange(v: unknown, min: number, max: number): number | null {
  if (v === undefined || v === null || v === '') return null
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isInteger(n) || n < min || n > max) return null
  return n
}

/**
 * GET /api/profile — fetch the authenticated user's primary person record.
 */
export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('persons')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_primary', true)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

/**
 * PATCH /api/profile — update the authenticated user's primary person record.
 */
export async function PATCH(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const first_name = str(body.first_name, 100)
  const last_name = str(body.last_name, 100)
  if (!first_name || !last_name) {
    return NextResponse.json({ error: 'first_name and last_name are required' }, { status: 400 })
  }

  const current_city = str(body.current_city, 100)
  const current_state = str(body.current_state, 50)
  const middle_name = str(body.middle_name, 100)
  const age = intInRange(body.age, 0, 130)

  const previous_cities = strArr(body.previous_cities, MAX_ARR, 100)
  const previous_states = strArr(body.previous_states, MAX_ARR, 50)
  const phone_numbers = strArr(body.phone_numbers, MAX_ARR, 32)
  const email_addresses = strArr(body.email_addresses, MAX_ARR, 254)
  const relatives = strArr(body.relatives, MAX_ARR, 200)

  if (
    previous_cities === null ||
    previous_states === null ||
    phone_numbers === null ||
    email_addresses === null ||
    relatives === null
  ) {
    return NextResponse.json({ error: 'Invalid array field (check types and size limits)' }, { status: 400 })
  }

  // Light email shape check
  for (const e of email_addresses) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      return NextResponse.json({ error: `Invalid email: ${e}` }, { status: 400 })
    }
  }
  // Phone: digits/spaces/+()- only
  for (const p of phone_numbers) {
    if (!/^[+\d][\d\s().-]{4,31}$/.test(p)) {
      return NextResponse.json({ error: `Invalid phone: ${p}` }, { status: 400 })
    }
  }

  const { data, error } = await supabase
    .from('persons')
    .update({
      first_name,
      last_name,
      middle_name,
      age,
      current_city,
      current_state,
      previous_cities,
      previous_states,
      phone_numbers,
      email_addresses,
      relatives,
    })
    .eq('user_id', user.id)
    .eq('is_primary', true)
    .select()
    .single()

  if (error) {
    logger.error({ err: error, user_id: user.id }, 'profile PATCH failed')
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  await audit({
    userId: user.id,
    event: 'profile.updated',
    resource: 'persons',
    resourceId: data.id,
    diff: { first_name, last_name, current_city, current_state },
  })

  return NextResponse.json(data)
}