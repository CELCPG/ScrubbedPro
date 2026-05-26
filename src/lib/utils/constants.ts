/**
 * Shared constants across the application.
 */

// Brand
export const APP_NAME = 'Scrubbed.Pro'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://scrubbed.pro'
export const TAGLINE = 'They sold your number. We take it back.'

// Risk tier score thresholds
export const RISK_TIER_THRESHOLDS = {
  CRITICAL: 80,
  HIGH: 60,
  MEDIUM: 40,
  LOW: 0,
} as const

// Scan settings
export const SCAN_TIMEOUT_SECONDS = 300 // 5 minutes
export const BROKER_COUNT = 200 // advertised

// Removal estimates (in days)
export const REMOVAL_ESTIMATES = {
  fast: 14,
  typical: 30,
  slow: 45,
} as const

// Re-scan interval (in days)
export const DEFAULT_RESCAN_INTERVAL_DAYS = 30