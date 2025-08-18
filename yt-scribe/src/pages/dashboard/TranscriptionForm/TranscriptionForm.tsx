'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { FORM_FIELD_NAMES } from './constants/formConstants'
import { useTranscriptionFormController } from './hooks/useTranscriptionFormController'
import { TranscriptionFormData } from './schemas/transcriptionSchema'

interface TranscriptionFormProps {
  onTranscriptChange?: (transcript: string) => void
  onTabChange?: (tab: string) => void
  onAIProcessingStart?: () => void
  onAIProcessingComplete?: () => void
  showTranscriptTab?: boolean
  showPurposeTab?: boolean
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
  showTranscriptTab = false,
  showPurposeTab = false,
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
      if (!showTranscriptTab && !showPurposeTab) {
        onTabChange?.('transcript')
        onStepComplete?.('youtube')
      }
    },
    externalTranscript,
  })

  const {
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods

  // Watch form values for conditional rendering
  const transcript = watch(FORM_FIELD_NAMES.TRANSCRIPT)
  const [showAISection, setShowAISection] = useState(false)

  // Check if transcript is available
  const hasTranscript = Boolean(transcript && transcript.trim().length > 0)

  // Show AI section when user clicks "Przetwórz z AI"
  const handleAISubmit = (data: TranscriptionFormData) => {
    setShowAISection(true)
    onAIProcessingStart?.()
    // Small delay to show the animation before processing
    setTimeout(() => {
      onSubmit(data)
    }, 300)
  }

  // Reset AI section when transcript changes
  useEffect(() => {
    if (!hasTranscript) {
      setShowAISection(false)
    }
  }, [hasTranscript])

  // Handle AI processing completion
  useEffect(() => {
    if (!isAIProcessing && showAISection) {
      onAIProcessingComplete?.()
    }
  }, [isAIProcessing, showAISection, onAIProcessingComplete])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleAISubmit)} className='space-y-4'>
        <FormFields
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={fetchTranscript}
          canFetchTranscript={canFetchTranscript}
          hasTranscript={hasTranscript}
          showAISection={showAISection}
          showTranscriptTab={showTranscriptTab}
          showPurposeTab={showPurposeTab}
          onTabChange={onTabChange}
          onSubmit={handleSubmit(handleAISubmit)}
          transcriptError={transcriptError}
          onStepComplete={onStepComplete}
        />
        <AnimatePresence>
          {hasTranscript && !showTranscriptTab && !showPurposeTab && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}>
              <SubmitButton
                isLoading={isAIProcessing}
                isValid={isValid}
                isTranscriptLoading={isTranscriptLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </FormProvider>
  )
}
