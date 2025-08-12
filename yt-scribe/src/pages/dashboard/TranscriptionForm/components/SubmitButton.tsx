'use client'

import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
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
      className='w-full flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 mt-4'>
      {isLoading ? (
        <>
          <Loader2 className='animate-spin mr-2' />
          <span>{LOADING_MESSAGES.ANALYZING}</span>
        </>
      ) : (
        <>
          <Search className='mr-2 h-5 w-5' />
          <span>Generuj</span>
        </>
      )}
    </Button>
  )
}
