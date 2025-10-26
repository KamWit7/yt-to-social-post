'use client'

import { cn } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyButtonProps {
  text: string
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

function CopyButton({
  text,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (!text?.trim()) {
        return
      }

      await navigator.clipboard.writeText(text)
      setIsCopied(true)

      // Reset icon after 2 seconds for optimal user experience
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
    }
  }

  return (
    <button
      type='button'
      onClick={handleCopy}
      disabled={disabled}
      className={cn(
        'relative p-2 rounded-lg transition-all duration-200 ease-out',
        disabled
          ? undefined
          : isCopied
          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800  hover:scale-110 active:scale-95',
        className
      )}
      title={isCopied ? 'Skopiowane!' : 'Kopiuj do schowka'}
      aria-label={ariaLabel || (isCopied ? 'Skopiowane' : 'Kopiuj do schowka')}>
      <div className='relative w-4 h-4'>
        <Copy
          className={cn(
            'absolute inset-0 w-4 h-4 transition-all duration-300 ease-out transform',
            isCopied
              ? 'opacity-0 rotate-90 scale-50'
              : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <Check
          className={cn(
            'absolute inset-0 w-4 h-4 transition-all duration-300 ease-out transform',
            isCopied
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50'
          )}
        />
      </div>
    </button>
  )
}

export default CopyButton
