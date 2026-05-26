'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface RobocallRiskAlertProps {
  brokerNames: string[]
  onPrioritize: () => void
}

export function RobocallRiskAlert({ brokerNames, onPrioritize }: RobocallRiskAlertProps) {
  return (
    <Card className="mb-6 border-l-4 border-risk bg-risk-light">
      <div className="flex items-start gap-4">
        <span className="text-2xl">📞</span>
        <div className="flex-1">
          <p className="font-medium text-risk">
            Your phone number is on {brokerNames.length} broker(s) that sell to robocallers.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Removing these first will reduce spam calls within 30-60 days.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {brokerNames.map(name => (
              <span key={name} className="rounded-full bg-white px-2 py-0.5 text-xs text-risk border border-risk/20">
                {name}
              </span>
            ))}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onPrioritize}>
          Prioritize these
        </Button>
      </div>
    </Card>
  )
}