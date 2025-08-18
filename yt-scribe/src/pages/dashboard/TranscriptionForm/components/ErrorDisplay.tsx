'use client'

import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  error: Error
  onRetry?: () => void
  isRetrying?: boolean
  showBackButton?: boolean
  onBack?: () => void
}

export function ErrorDisplay({
  error,
  onRetry,
  isRetrying,
  showBackButton = false,
  onBack,
}: ErrorDisplayProps) {
  return (
    <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
      <div className='flex items-center gap-2 mb-3'>
        <svg
          className='w-5 h-5 text-red-500'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
        <p className='text-sm font-medium text-red-800 dark:text-red-200'>
          Nie udało się pobrać transkrypcji
        </p>
      </div>
      <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
        {error.message ||
          'Wystąpił błąd podczas pobierania transkrypcji z YouTube.'}
      </p>
      <div className='flex gap-3'>
        {onRetry && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={onRetry}
            disabled={isRetrying}
            className='text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30'>
            {isRetrying ? 'Pobieram...' : 'Spróbuj ponownie'}
          </Button>
        )}
        {showBackButton && onBack && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={onBack}
            className='text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-900/30'>
            Wróć do linku
          </Button>
        )}
      </div>
    </div>
  )
}
