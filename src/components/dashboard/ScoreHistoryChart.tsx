'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { Scan } from '@/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

interface ScoreHistoryChartProps {
  scans: Scan[]
}

const tierColors = {
  CRITICAL: '#991B1B',
  HIGH: '#B45309',
  MEDIUM: '#D97706',
  LOW: '#1D6A3A',
}

export function ScoreHistoryChart({ scans }: ScoreHistoryChartProps) {
  const data = scans.slice(0, 12).reverse().map(scan => ({
    date: formatRelativeTime(scan.started_at),
    score: scan.exposure_score ?? 0,
    tier: scan.risk_tier ?? 'LOW',
  }))

  return (
    <div style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
            }}
            formatter={(value: number, _name: string, props: any) => [
              `${value} / 100`,
              props.payload.tier,
            ]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#0F2D5E"
            strokeWidth={2}
            dot={{ fill: '#0F2D5E', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}