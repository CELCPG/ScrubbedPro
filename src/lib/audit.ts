/**
 * Immutable audit log — append-only, never updated or deleted.
 * Call `audit(...)` after every sensitive action.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export type AuditEvent =
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.canceled'
  | 'subscription.payment_failed'
  | 'profile.updated'
  | 'scan.started'
  | 'scan.completed'
  | 'scan.failed'
  | 'removal.submitted'
  | 'removal.verified'
  | 'account.deleted'
  | 'account.exported'

interface AuditParams {
  userId: string
  event: AuditEvent
  resource?: string
  resourceId?: string
  diff?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

/**
 * Fire-and-forget audit write — never blocks the response.
 */
export async function audit(params: AuditParams) {
  try {
    const supabase = createAdminClient()
    await supabase.from('audit_log').insert({
      user_id: params.userId,
      event: params.event,
      resource: params.resource,
      resource_id: params.resourceId,
      diff: params.diff ?? null,
      ip_address: params.ipAddress ?? null,
      user_agent: params.userAgent ?? null,
    })
  } catch {
    // Audit failures must never break user-facing flows
    // Log locally but swallow the error
  }
}

/**
 * Read audit log entries for a user (for support/admin use).
 */
export async function getAuditLog(userId: string, limit = 50) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}