'use client'

import {
  DASHBOARD_TABS,
  TRANSCRIPTION_FORMS_STORAGE_KEY,
} from '@/components/dashboard/Dashboard.helpers'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/utils/constants'
import { saveStateToSessionStorage } from '@/utils/sessionStorage'
import { Lock } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { useTranscriptionForms } from '../../context'

interface AuthGateProps {
  children: React.ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { data: session, status } = useSession()
  const { formStepsState, activeTab, stepCompleted } = useTranscriptionForms()

  function handleSaveState() {
    saveStateToSessionStorage(TRANSCRIPTION_FORMS_STORAGE_KEY, {
      transcript: formStepsState[DASHBOARD_TABS.TRANSCRIPT] || '',
      url: formStepsState[DASHBOARD_TABS.YOUTUBE] || '',
      activeTab,
      stepCompleted,
    })
  }

  // Show loading spinner while checking session
  if (status === 'loading') {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  // If user is authenticated, render children (PurposeForm)
  if (session?.user) {
    return <>{children}</>
  }

  // If user is not authenticated, show auth gate
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-800/10 backdrop-blur-sm rounded-xl border-2 border-blue-200 dark:border-blue-700 p-8 max-w-md w-full mx-4'>
        <div className='text-center space-y-6'>
          {/* Animated Icon */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-blue-500/20 rounded-full animate-pulse'></div>
              <div className='relative bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full'>
                <Lock className='w-8 h-8 text-white animate-pulse' />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              Dostęp do AI wymaga logowania
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              Aby skorzystać z funkcji przetwarzania AI, musisz się zalogować
              lub utworzyć konto
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-2'>
            <Button asChild variant='outline' className='flex-1'>
              <Link href={ROUTES.LOGIN} onClick={handleSaveState}>
                Zaloguj się
              </Link>
            </Button>
            <Button
              asChild
              className='flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'>
              <Link href={ROUTES.REGISTER} onClick={handleSaveState}>
                Zarejestruj się
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
