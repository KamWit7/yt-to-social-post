'use client'

import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface FormServerErrorProps {
  error?: {
    message?: string
  }
  className?: string
}

/**
 * Component for displaying server-side form errors (root errors)
 * Uses a more prominent style with background, border, and icon
 */
export function FormServerError({ error, className }: FormServerErrorProps) {
  if (!error?.message) return null

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 p-3 rounded-lg',
        'bg-red-50 dark:bg-red-950/20',
        'border border-red-200 dark:border-red-800',
        'text-sm text-red-800 dark:text-red-200',
        className
      )}
      role='alert'>
      <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
      <p>{error.message}</p>
    </div>
  )
}
