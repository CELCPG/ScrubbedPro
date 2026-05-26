import { cn } from '@/lib/utils/cn'

interface CardProps {
  className?: string
  children: React.ReactNode
}

/**
 * Card wrapper — consistent card styling across the app.
 */
export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-6 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}