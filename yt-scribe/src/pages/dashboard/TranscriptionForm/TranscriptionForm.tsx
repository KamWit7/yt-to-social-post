'use client'

import { FormProvider } from 'react-hook-form'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { useTranscriptionFormController } from './hooks/useTranscriptionFormController'

interface TranscriptionFormProps {
  onTranscriptChange?: (transcript: string) => void
}

export default function TranscriptionForm({
  onTranscriptChange,
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
  } = useTranscriptionFormController({ onTranscriptChange })

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormFields
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={fetchTranscript}
          canFetchTranscript={canFetchTranscript}
        />
        <SubmitButton
          isLoading={isAIProcessing}
          isValid={isValid}
          isTranscriptLoading={isTranscriptLoading}
        />
      </form>
      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </FormProvider>
  )
}
