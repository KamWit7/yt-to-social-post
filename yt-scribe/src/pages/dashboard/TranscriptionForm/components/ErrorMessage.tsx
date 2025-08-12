'use client'

import { AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const [displayMessage, setDisplayMessage] = useState('')

  // Smooth show/hide with small exit delay to allow animation
  useEffect(() => {
    const EXIT_DURATION_MS = 220

    if (message) {
      setDisplayMessage(message)
      setIsMounted(true)
      // Next tick to trigger CSS transition from initial hidden state
      const id = setTimeout(() => setIsShown(true), 16)
      return () => clearTimeout(id)
    }

    if (isMounted) {
      setIsShown(false)
      const id = setTimeout(() => {
        setIsMounted(false)
        setDisplayMessage('')
      }, EXIT_DURATION_MS)
      return () => clearTimeout(id)
    }
  }, [message, isMounted])

  if (!isMounted) return null

  return (
    <div
      role='alert'
      aria-live='assertive'
      className={[
        'mt-4 flex items-start gap-2 sm:gap-3 px-3.5 py-3 rounded-xl border',
        'transition-all duration-200 ease-out will-change-transform',
        isShown
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-2 scale-[0.98]',
        // Light mode
        'bg-red-50/80 border-red-200 text-red-800',
        // Subtle depth
        'shadow-[0_6px_20px_-10px_rgba(220,38,38,0.6)]',
        // Dark mode
        'dark:bg-red-900/20 dark:border-red-800/60 dark:text-red-200',
      ].join(' ')}>
      <AlertTriangle
        className='h-5 w-5 mt-0.5 text-red-500 drop-shadow-sm animate-pulse'
        aria-hidden='true'
      />
      <p className='text-[0.95rem] leading-relaxed font-medium tracking-wide'>
        <span className='bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent'>
          {displayMessage}
        </span>
      </p>
    </div>
  )
}
