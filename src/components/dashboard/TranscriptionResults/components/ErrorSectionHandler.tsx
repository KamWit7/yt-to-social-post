'use client'

import {
  DEFAULT_AI_MODEL,
  DEFAULT_LANGUAGE,
  DEFAULT_TEMPERATURE_MODE,
  PurposeValue,
} from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { ReactNode, useCallback, useState } from 'react'
import { DASHBOARD_TABS } from '../../Dashboard.helpers'
import { useTranscriptionForms } from '../../TranscriptionForms/TranscriptionFormsContext'

interface ErrorSectionHandlerProps {
  children: ReactNode
  sectionName: string
  purpose: PurposeValue
  aiError?: string
  isLoading?: boolean
}

export function ErrorSectionHandler({
  children,
  sectionName,
  purpose,
  aiError,
  isLoading,
}: ErrorSectionHandlerProps) {
  const { aiProcessing, formStepsState } = useTranscriptionForms()
  const { processTranscript, resetByPurpose } = aiProcessing
  const [isRetrying, setIsRetrying] = useState(false)

  const handleFetchErrorTranscript = useCallback(async () => {
    resetByPurpose(purpose)
    setIsRetrying(true)

    try {
      await processTranscript(purpose, {
        transcript: formStepsState[DASHBOARD_TABS.TRANSCRIPT] || '',
        purpose,
        language:
          formStepsState[DASHBOARD_TABS.PURPOSE]?.language || DEFAULT_LANGUAGE,
        model:
          formStepsState[DASHBOARD_TABS.PURPOSE]?.model || DEFAULT_AI_MODEL,
        customPrompt:
          formStepsState[DASHBOARD_TABS.PURPOSE]?.customPrompt || '',
        temperatureMode:
          formStepsState[DASHBOARD_TABS.PURPOSE]?.temperatureMode ||
          DEFAULT_TEMPERATURE_MODE,
      })
    } finally {
      setIsRetrying(false)
    }
  }, [resetByPurpose, purpose, processTranscript, formStepsState])

  // If there's an error for this section, show enhanced error card
  if (aiError && !isLoading) {
    return (
      <Card className='border-muted-foreground/20 bg-muted/30 dark:bg-muted/10 flex-1 shadow-sm hover:shadow-md transition-all duration-200'>
        <CardContent className='pt-6 pb-6'>
          {/* Main Error Display */}
          <div className='space-y-4'>
            {/* Error Header with Icon */}
            <div className='flex items-start gap-4'>
              <div className='w-10 h-10 bg-muted dark:bg-muted/50 rounded-lg flex items-center justify-center'>
                <AlertTriangle className='w-5 h-5 text-muted-foreground' />
              </div>

              <div className='flex-1 space-y-2'>
                <h3 className='text-base font-medium text-foreground leading-tight'>
                  Błąd podczas przetwarzania {sectionName.toLowerCase()}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Wystąpił problem podczas generowania treści. Możesz spróbować
                  ponownie.
                </p>
              </div>
            </div>

            {/* Error Details - Always Visible */}
            <div className='pt-3 border-t border-border'>
              <div className='bg-muted/50 dark:bg-muted/20 rounded-lg p-4 space-y-3'>
                <h4 className='text-sm font-medium text-foreground'>
                  Szczegóły błędu:
                </h4>
                <p className='text-xs text-muted-foreground font-mono bg-background/80 dark:bg-background/40 p-3 rounded border leading-relaxed break-words'>
                  {aiError}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className='pt-2'>
              <button
                onClick={handleFetchErrorTranscript}
                disabled={isRetrying}
                className='flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'>
                {isRetrying ? (
                  <>
                    <RefreshCw className='w-4 h-4 animate-spin' />
                    <span>Ponawiam...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className='w-4 h-4' />
                    <span>Spróbuj ponownie</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's no error, render the children
  return <>{children}</>
}
