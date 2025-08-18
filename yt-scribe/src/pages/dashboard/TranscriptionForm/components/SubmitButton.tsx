'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'
import { LOADING_MESSAGES } from '../constants/formConstants'

interface SubmitButtonProps {
  isLoading: boolean
  isValid: boolean
  isTranscriptLoading?: boolean
}

export function SubmitButton({
  isLoading,
  isValid,
  isTranscriptLoading,
}: SubmitButtonProps) {
  return (
    <Button
      type='submit'
      disabled={isLoading || isTranscriptLoading || !isValid}
      className='w-full flex-shrink-0 flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600 text-lg'>
      {isLoading ? (
        <>
          <Loader2 className='animate-spin mr-3 w-6 h-6' />
          <span>{LOADING_MESSAGES.ANALYZING}</span>
        </>
      ) : (
        <>
          <Sparkles className='mr-3 h-6 w-6' />
          <span>Przetwórz z AI</span>
        </>
      )}
    </Button>
  )
}
