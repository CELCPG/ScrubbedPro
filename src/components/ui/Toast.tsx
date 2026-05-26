'use client'

import { cn } from '@/lib/utils/cn'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

/**
 * Toast notification — auto-dismisses after duration.
 */
export function Toast({ message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeClasses = {
    success: 'bg-safe text-white',
    error: 'bg-critical text-white',
    info: 'bg-navy text-white',
  }

  return (
    <div className={cn(
      'fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 shadow-lg',
      'flex items-center gap-3 text-sm',
      typeClasses[type]
    )}>
      <span>{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}