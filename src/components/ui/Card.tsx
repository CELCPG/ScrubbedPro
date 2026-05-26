import { cn } from '@/lib/utils/cn'
import type { ReactNode, MouseEventHandler } from 'react'

interface CardProps {
  className?: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}

/**
 * Card wrapper — consistent card styling across the app.
 */
export function Card({ className, children, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-6 shadow-sm',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {children}
    </div>
  )
}