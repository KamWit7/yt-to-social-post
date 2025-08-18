'use client'

import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import { useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'
import { ErrorMessage } from './components/ErrorMessage'
import { PurposeSection } from './components/sections/PurposeSection'
import { TranscriptSection } from './components/sections/TranscriptSection'
import { YouTubeSection } from './components/sections/YouTubeSection'
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

  // Dictionary data for purpose options
  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )

  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data?.map((item) => ({
        label: item.label,
        value: item.code,
      }))
    : []

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleAISubmit)} className='space-y-4'>
        <div className='space-y-12'>
          {/* Section 1: URL Input and Generate Button */}
          {stepKey === DASHBOARD_TABS.YOUTUBE && (
            <YouTubeSection
              isLoading={isAIProcessing}
              isTranscriptLoading={isTranscriptLoading}
              onFetchTranscript={fetchTranscript}
              canFetchTranscript={canFetchTranscript}
              transcriptError={transcriptError}
            />
          )}

          {/* Section 2: Transcript and Purpose Selection - appears after transcript is available */}
          {stepKey === DASHBOARD_TABS.TRANSCRIPT && (
            <TranscriptSection
              isLoading={isAIProcessing}
              isTranscriptLoading={isTranscriptLoading}
              stepKey={stepKey}
              transcriptError={transcriptError}
              onFetchTranscript={fetchTranscript}
              onStepComplete={onStepComplete}
              onTabChange={onTabChange}
            />
          )}

          {/* Section 3: Purpose Selection */}
          {stepKey === DASHBOARD_TABS.PURPOSE && (
            <PurposeSection
              isLoading={isAIProcessing}
              isTranscriptLoading={isTranscriptLoading}
              isPurposeLoading={isPurposeLoading}
              stepKey={stepKey}
              purposeOptions={purposeOptions}
              transcriptError={transcriptError}
              onFetchTranscript={fetchTranscript}
              onStepComplete={onStepComplete}
              onTabChange={onTabChange}
              onSubmit={handleSubmit(handleAISubmit)}
            />
          )}
        </div>
      </form>
      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </FormProvider>
  )
}
