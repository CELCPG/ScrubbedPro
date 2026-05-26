'use client'

import type { RiskTier } from '@/types'

interface RiskTierBadgeProps {
  tier: RiskTier
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

const variantClasses = {
  CRITICAL: 'bg-critical-light text-critical',
  HIGH: 'bg-risk-light text-risk',
  MEDIUM: 'bg-amber-50 text-amber-700',
  LOW: 'bg-safe-light text-safe',
}

export function RiskTierBadge({ tier, size = 'md' }: RiskTierBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${variantClasses[tier]}`}>
      {tier}
    </span>
  )
}