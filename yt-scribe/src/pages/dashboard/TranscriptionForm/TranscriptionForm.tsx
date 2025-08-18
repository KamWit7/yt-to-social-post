'use client'

import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { useTranscriptionFormController } from './hooks/useTranscriptionFormController'
import { TranscriptionFormData } from './schemas/transcriptionSchema'

interface TranscriptionFormProps {
  onTranscriptChange?: (transcript: string) => void
  onTabChange?: (tab: string) => void
  onAIProcessingStart?: () => void
  onAIProcessingComplete?: () => void
  stepKey?: DashboardTab
  onStepComplete?: (
    step: 'youtube' | 'transcript' | 'purpose' | 'results'
  ) => void
  externalTranscript?: string
}

export default function TranscriptionForm({
  onTranscriptChange,
  onTabChange,
  onAIProcessingStart,
  onAIProcessingComplete,
  stepKey = DASHBOARD_TABS.YOUTUBE,
  onStepComplete,
  externalTranscript,
}: TranscriptionFormProps) {
  const {
    methods,
    isTranscriptLoading,
    isAIProcessing,
    aiError,
    transcriptError,
    onSubmit,
    fetchTranscript,
    canFetchTranscript,
  } = useTranscriptionFormController({
    onTranscriptChange,
    onTranscriptSuccess: () => {
      // Only change tab if we're on the first tab (YouTube) and transcript was fetched successfully
      if (stepKey === DASHBOARD_TABS.YOUTUBE) {
        onTabChange?.(DASHBOARD_TABS.TRANSCRIPT)
        onStepComplete?.(DASHBOARD_TABS.YOUTUBE)
      }
    },
    externalTranscript,
  })

  const { handleSubmit } = methods

  // Show AI section when user clicks "Przetwórz z AI"
  const handleAISubmit = (data: TranscriptionFormData) => {
    onAIProcessingStart?.()
    onSubmit(data)
  }

  // Handle AI processing completion
  useEffect(() => {
    if (!isAIProcessing) {
      onAIProcessingComplete?.()
    }
  }, [isAIProcessing, onAIProcessingComplete])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleAISubmit)} className='space-y-4'>
        <FormFields
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={fetchTranscript}
          canFetchTranscript={canFetchTranscript}
          stepKey={stepKey}
          onTabChange={onTabChange}
          onSubmit={handleSubmit(handleAISubmit)}
          transcriptError={transcriptError}
          onStepComplete={onStepComplete}
        />
      </form>
      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </FormProvider>
  )
}
