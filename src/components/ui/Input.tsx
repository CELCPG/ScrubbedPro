import { cn } from '@/lib/utils/cn'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

/**
 * Styled text input with label and error state.
 */
export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'rounded-lg border border-gray-200 px-3 py-2 text-sm',
          'focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20',
          'disabled:bg-gray-50 disabled:cursor-not-allowed',
          error && 'border-critical focus:border-critical focus:ring-critical/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-critical">{error}</p>}
    </div>
  )
}