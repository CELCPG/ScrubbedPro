export type RiskTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type ScanStatus = 'queued' | 'running' | 'completed' | 'failed' | 'canceled'
export type RemovalStatus =
  | 'pending'
  | 'submitted'
  | 'verification_pending'
  | 'verified_removed'
  | 're_listed'
  | 'failed'
  | 'requires_manual'
export type BrokerStatus = 'found' | 'not_found' | 'blocked' | 'error'
export type OptOutMethod = 'web_form' | 'email' | 'manual'
export type Priority = 'high' | 'medium' | 'low'
export type Plan = 'individual' | 'family' | 'small_biz'

export interface Person {
  id: string
  user_id: string
  first_name: string
  last_name: string
  middle_name?: string
  age?: number
  current_city: string
  current_state: string
  previous_cities: string[]
  previous_states: string[]
  phone_numbers: string[]
  email_addresses: string[]
  relatives: string[]
  is_primary: boolean
  created_at: string
  updated_at: string
}

export interface Scan {
  id: string
  person_id: string
  user_id: string
  status: ScanStatus
  exposure_score?: number
  risk_tier?: RiskTier
  total_brokers_scanned: number
  brokers_with_listings: number
  brokers_blocked: number
  fields_most_exposed: string[]
  robocall_risk_brokers: string[]
  report_json?: ScanReport
  scan_duration_seconds?: number
  started_at: string
  completed_at?: string
  next_scan_at?: string
}

export interface BrokerResult {
  id: string
  scan_id: string
  person_id: string
  user_id: string
  broker_id: string
  broker_name: string
  status: BrokerStatus
  listing_url?: string
  match_confidence?: number
  fields_exposed: string[]
  priority: Priority
  robocall_risk: boolean
  scraped_at: string
}

export interface RemovalQueueItem {
  id: string
  person_id: string
  user_id: string
  broker_result_id?: string
  broker_id: string
  broker_name: string
  status: RemovalStatus
  opt_out_url?: string
  opt_out_method?: OptOutMethod
  requires_id: boolean
  priority: Priority
  submitted_at?: string
  verified_removed_at?: string
  re_listed_at?: string
  next_verification_at?: string
  estimated_removal_days?: number
  notes?: string
  created_at: string
}

export interface ScanReport {
  report_id: string
  generated_at: string
  person: { name: string; current_location: string }
  exposure_score: number
  risk_tier: RiskTier
  summary: string
  total_brokers_scanned: number
  brokers_with_listings: number
  brokers_blocked: number
  fields_most_exposed: string[]
  robocall_risk_brokers: string[]
  listings: BrokerResult[]
  removal_queue: RemovalQueueItem[]
  scan_duration_seconds: number
  next_scan_recommended: string
}

export interface Subscription {
  plan: Plan
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  current_period_end: string
  cancel_at_period_end: boolean
  stripe_customer_id?: string
  stripe_sub_id?: string
}

export interface AuditLogEntry {
  id: string
  user_id: string
  action: string
  resource?: string
  resource_id?: string
  metadata?: Record<string, unknown>
  ip_address?: string
  created_at: string
}