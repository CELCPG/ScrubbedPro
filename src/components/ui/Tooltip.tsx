import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  text: string
  children: React.ReactNode
  className?: string
}

/**
 * Simple tooltip on hover.
 */
export function Tooltip({ text, children, className }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <span className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5',
        'rounded bg-gray-800 px-2 py-1 text-xs text-white',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        'pointer-events-none whitespace-nowrap',
        className
      )}>
        {text}
      </span>
    </div>
  )
}