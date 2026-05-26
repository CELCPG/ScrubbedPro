'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import type { RiskTier } from '@/types'

interface ExposureScoreGaugeProps {
  score: number
  riskTier: RiskTier
}

const tierColors: Record<RiskTier, string> = {
  CRITICAL: '#991B1B',
  HIGH: '#B45309',
  MEDIUM: '#D97706',
  LOW: '#1D6A3A',
}

const TIER_EXPLANATIONS: Record<RiskTier, { headline: string; factors: string[]; consequence: string }> = {
  CRITICAL: {
    headline: 'Your data is heavily exposed',
    factors: [
      'Your phone number is listed on multiple broker sites',
      'Your home address is publicly accessible',
      'Your relatives\' data is also exposed',
      'At least one broker sells to robocaller networks',
    ],
    consequence: 'Expect 10+ spam calls per day. Your data can be used for doxxing, harassment, and identity theft.',
  },
  HIGH: {
    headline: 'Your personal information is widely listed',
    factors: [
      'Your phone number appears on 2-5 broker sites',
      'Your address is searchable by strangers',
      'Your email is associated with your profile',
    ],
    consequence: 'You likely receive 3-8 spam calls daily. Scammers can use this data to impersonate companies.',
  },
  MEDIUM: {
    headline: 'Your data is moderately exposed',
    factors: [
      'Your profile appears on 1-2 broker sites',
      'Limited personal details are publicly listed',
    ],
    consequence: 'Occasional spam calls and targeted marketing. Monitor for new listings monthly.',
  },
  LOW: {
    headline: 'Your exposure is low',
    factors: [
      'Few data broker listings found',
      'Your information is not widely circulated',
    ],
    consequence: 'Keep monitoring monthly to catch new listings before they spread.',
  },
}

export function ExposureScoreGauge({ score, riskTier }: ExposureScoreGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const radius = 80
  const stroke = 16
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const color = tierColors[riskTier]
  const info = TIER_EXPLANATIONS[riskTier]

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
        {/* Info button */}
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="mt-1 text-gray-400 hover:text-navy transition-colors"
          aria-label="What affects my score?"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute left-full top-0 ml-4 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <h4 className="font-semibold text-navy text-sm mb-1">{info.headline}</h4>
          <ul className="space-y-1.5 mt-3">
            {info.factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-critical mt-0.5 shrink-0">•</span>
                {factor}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <strong className="text-gray-700">Consequence:</strong> {info.consequence}
            </p>
          </div>
          {/* Score formula hint */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Score based on: phone exposure, address exposure, broker count, robocaller risk
          </div>
        </div>
      )}
    </div>
  )
}
