'use client'

import { useEffect } from 'react'
import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'
import { ErrorMessage } from './components/ErrorMessage'
import { PurposeForm } from './forms/PurposeForm/PurposeForm'
import { TranscriptForm } from './forms/TranscriptForm/TranscriptForm'
import { YouTubeForm } from './forms/YouTubeForm/YouTubeForm'
import { useTranscriptionFormController } from './hooks/useTranscriptionFormController'
import { TranscriptionFormData } from './types/formTypes'

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

  // Purpose options and loading now handled inside PurposeForm

  return (
    <>
      {stepKey === DASHBOARD_TABS.YOUTUBE && (
        <YouTubeForm
          methods={methods}
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={fetchTranscript}
          canFetchTranscript={canFetchTranscript}
          transcriptError={transcriptError}
        />
      )}

      {stepKey === DASHBOARD_TABS.TRANSCRIPT && (
        <TranscriptForm
          methods={methods}
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          stepKey={stepKey}
          transcriptError={transcriptError}
          onFetchTranscript={fetchTranscript}
          onStepComplete={onStepComplete}
          onTabChange={onTabChange}
        />
      )}

      {stepKey === DASHBOARD_TABS.PURPOSE && (
        <PurposeForm
          methods={methods}
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          stepKey={stepKey}
          transcriptError={transcriptError}
          onFetchTranscript={fetchTranscript}
          onStepComplete={onStepComplete}
          onTabChange={onTabChange}
          onSubmit={handleAISubmit}
        />
      )}

      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </>
  )
}
