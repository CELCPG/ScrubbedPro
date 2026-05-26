'use client'

import { Card } from '@/components/ui/Card'

interface StatBarProps {
  stats: { label: string; value: string | number; highlight?: boolean }[]
}

export function StatBar({ stats }: StatBarProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`text-center py-4 ${stat.highlight ? 'border-navy border' : ''}`}>
          <div className={`text-2xl font-medium ${stat.highlight ? 'text-navy' : 'text-gray-700'}`}>
            {stat.value}
          </div>
          <div className="mt-1 text-xs text-gray-500">{stat.label}</div>
        </Card>
      ))}
    </div>
  )
}