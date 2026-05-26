'use client'

import { cn } from '@/lib/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary: 'bg-navy text-white hover:bg-navy-light active:bg-navy-dark',
  secondary: 'bg-surface text-navy border border-gray-200 hover:bg-gray-100 active:bg-gray-200',
  danger: 'bg-critical text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'text-navy hover:bg-surface active:bg-gray-100',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

/**
 * Primary UI button component.
 * Variants: primary (navy), secondary (outlined), danger (red), ghost (text-only).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}