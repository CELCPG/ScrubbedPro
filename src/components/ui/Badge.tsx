import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  variant?: 'default' | 'safe' | 'risk' | 'critical' | 'sky'
  className?: string
  children: React.ReactNode
}

/**
 * Status badge component. Color-coded by severity.
 */
export function Badge({ variant = 'default', className, children }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    safe: 'bg-safe-light text-safe',
    risk: 'bg-risk-light text-risk',
    critical: 'bg-critical-light text-critical',
    sky: 'bg-sky text-navy',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}