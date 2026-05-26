'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BrokerResult } from '@/types'

interface BrokerResultCardProps {
  result: BrokerResult
  onAddToQueue?: (result: BrokerResult) => void
}

const priorityColors = {
  high: 'bg-critical-light text-critical',
  medium: 'bg-risk-light text-risk',
  low: 'bg-gray-100 text-gray-600',
}

const FIELD_RISK: Record<string, { label: string; consequence: string; legalBasis: string }> = {
  phone: {
    label: 'Phone number',
    consequence: 'Spam calls,robocalls, and scam attempts. Your number is sold to telemarketers and骗子 (scam) networks.',
    legalBasis: 'FCC rules prohibit robocalls to cell phones without consent. You have the right to demand removal.',
  },
  address: {
    label: 'Home address',
    consequence: 'Physical safety risk. Anyone can find where you live. Used for stalking,SWATing, and burglary reconnaissance.',
    legalBasis: 'CCPA and state privacy laws require brokers to honor opt-out requests within 15 days.',
  },
  email: {
    label: 'Email address',
    consequence: 'Phishing emails, spam, and credential theft attempts. Email is often sold to marketing lists.',
    legalBasis: 'CAN-SPAM Act gives you the right to opt out of commercial email lists.',
  },
  relatives: {
    label: 'Family members',
    consequence: 'Your family members become targets for the same scams and harassment. Their data is exposed too.',
    legalBasis: 'You can request removal of your family\'s data on their behalf under most state privacy laws.',
  },
  age: {
    label: 'Age / birth year',
    consequence: 'Enables age-targeted scams and discrimination. Insurance companies and employers may use this data.',
    legalBasis: 'Age discrimination laws protect your right to remove birth year from data broker listings.',
  },
  criminal: {
    label: 'Criminal records',
    consequence: 'False criminal records can destroy your reputation, cost you jobs, and affect housing applications.',
    legalBasis: 'FCRA gives you the right to dispute and remove inaccurate criminal record listings.',
  },
}

function getFieldInfo(fields: string[]) {
  return fields.map(f => FIELD_RISK[f] || {
    label: f,
    consequence: 'Your personal information is publicly accessible.',
    legalBasis: 'You have the right to request removal under applicable privacy laws.',
  })
}

export function BrokerResultCard({ result, onAddToQueue }: BrokerResultCardProps) {
  const [expanded, setExpanded] = useState(false)
  const fieldInfos = getFieldInfo(result.fields_exposed || [])

  const robocallConsequence = result.robocall_risk
    ? '⚠️ This broker sells your phone number to robocaller networks — removing this first will reduce spam calls fastest.'
    : null

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-navy">{result.broker_name}</h3>
            {result.robocall_risk && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                📞 Robocall risk
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[result.priority] || 'bg-gray-100 text-gray-600'}`}>
              {result.priority} priority
            </span>
            <Badge variant={result.status === 'found' ? 'critical' : 'safe'}>
              {result.status === 'found' ? 'Listing found' : 'Not found'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Robocall risk alert */}
      {result.robocall_risk && result.status === 'found' && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
          {robocallConsequence}
        </div>
      )}

      {/* Match confidence */}
      {result.match_confidence && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Match confidence</span>
            <span className="font-medium">{Math.round(result.match_confidence * 100)}% — likely a real match</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-navy transition-all"
              style={{ width: `${result.match_confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Exposed fields with consequences */}
      {fieldInfos.length > 0 && (
        <div className="mt-3 space-y-2">
          {fieldInfos.map((fi, i) => (
            <div key={i} className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-navy">{fi.label} exposed</p>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{fi.consequence}</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                ↳ {fi.legalBasis}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Listing URL */}
      {result.listing_url && (
        <div className="mt-3">
          <a
            href={result.listing_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            View listing on {result.broker_name} →
          </a>
        </div>
      )}

      {/* Expand/collapse */}
      {fieldInfos.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-gray-400 hover:text-navy transition-colors"
        >
          {expanded ? '▲ Collapse details' : '▼ Why this matters + legal basis'}
        </button>
      )}

      {/* Action */}
      {result.status === 'found' && (
        <div className="mt-4">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onAddToQueue?.(result)}
          >
            Add to removal queue
          </Button>
        </div>
      )}
    </div>
  )
}
