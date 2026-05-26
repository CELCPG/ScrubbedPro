'use client'

import { cn } from '@/lib/utils/cn'
import type { RiskTier } from '@/types'

interface ExposureScoreGaugeProps {
  score: number
  riskTier: RiskTier
}

const tierColors = {
  CRITICAL: '#991B1B',
  HIGH: '#B45309',
  MEDIUM: '#D97706',
  LOW: '#1D6A3A',
}

const tierBgColors = {
  CRITICAL: 'bg-critical-light',
  HIGH: 'bg-risk-light',
  MEDIUM: 'bg-amber-50',
  LOW: 'bg-safe-light',
}

export function ExposureScoreGauge({ score, riskTier }: ExposureScoreGaugeProps) {
  const radius = 80
  const stroke = 16
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = tierColors[riskTier]

  return (
    <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
      <svg width={180} height={180} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={stroke}
        />
        {/* Foreground ring */}
        <circle
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-medium text-navy">{score}</span>
        <span className="text-xs text-gray-400 mt-0.5">out of 100</span>
      </div>
    </div>
  )
}