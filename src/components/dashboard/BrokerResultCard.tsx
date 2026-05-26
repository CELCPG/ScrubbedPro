import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { BrokerResult } from '@/types'

interface BrokerResultCardProps {
  result: BrokerResult
}

const priorityColors = {
  high: 'bg-critical-light text-critical',
  medium: 'bg-risk-light text-risk',
  low: 'bg-gray-100 text-gray-600',
}

export function BrokerResultCard({ result }: BrokerResultCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-navy">{result.broker_name}</h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[result.priority]}`}>
              {result.priority}
            </span>
            {result.robocall_risk && (
              <span className="text-xs text-critical" title="Sells data to robocallers">📞</span>
            )}
          </div>
        </div>
        <Badge variant={result.status === 'found' ? 'critical' : 'safe'}>
          {result.status === 'found' ? 'Listing found' : 'Not found'}
        </Badge>
      </div>

      {result.match_confidence && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Match confidence</span>
            <span>{Math.round(result.match_confidence * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-navy transition-all"
              style={{ width: `${result.match_confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {result.fields_exposed.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {result.fields_exposed.map(field => (
            <span
              key={field}
              className="rounded-full bg-sky px-2 py-0.5 text-xs text-navy"
            >
              {field}
            </span>
          ))}
        </div>
      )}

      {result.status === 'found' && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" className="w-full">
            Add to removal queue
          </Button>
        </div>
      )}
    </div>
  )
}