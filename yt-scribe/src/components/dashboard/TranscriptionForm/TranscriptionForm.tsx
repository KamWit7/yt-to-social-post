'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { useTranscript } from '@/api/hooks/useTranscript'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { DEFAULT_VALUES, FORM_FIELD_NAMES } from './constants/formConstants'
import { transcriptionSchema } from './schemas/transcriptionSchema'
import { TranscriptionFormData } from './types/formTypes'

interface TranscriptionFormProps {
  onTranscriptChange?: (transcript: string) => void
}

export default function TranscriptionForm({
  onTranscriptChange,
}: TranscriptionFormProps) {
  const [url, setUrl] = useState('')

  const methods = useForm<TranscriptionFormData>({
    resolver: zodResolver(transcriptionSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = methods

  // Watch URL field for changes
  const watchedUrl = watch(FORM_FIELD_NAMES.URL)

  // Fetch transcript when URL changes
  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    error: transcriptError,
  } = useTranscript(url, {
    enabled: !!url,
    retry: 2,
  })

  // Update transcript field when data is fetched
  useEffect(() => {
    if (transcriptData?.success && transcriptData.transcript) {
      setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcriptData.transcript)
      if (onTranscriptChange) {
        onTranscriptChange(transcriptData.transcript)
      }
    }
  }, [transcriptData, setValue, onTranscriptChange])

  // Update URL state when form URL changes
  useEffect(() => {
    if (watchedUrl && watchedUrl !== url) {
      setUrl(watchedUrl)
    }
  }, [watchedUrl, url])

  // Function to manually fetch transcript
  const handleFetchTranscript = useCallback(() => {
    if (watchedUrl) {
      setUrl(watchedUrl)
    }
  }, [watchedUrl])

  const {
    mutate: processAI,
    isPending: isAIProcessing,
    error: aiError,
  } = useAIProcessing()

  const onSubmit = useCallback(
    (data: TranscriptionFormData) => {
      processAI({
        transcript: data[FORM_FIELD_NAMES.TRANSCRIPT],
        purpose: data[FORM_FIELD_NAMES.PURPOSE],
        customPurpose: data[FORM_FIELD_NAMES.CUSTOM_PURPOSE],
        options: data.options,
      })
    },
    [processAI]
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormFields
          isLoading={isAIProcessing}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={handleFetchTranscript}
        />
        <SubmitButton isLoading={isAIProcessing} isValid={isValid} />
      </form>
      <ErrorMessage
        message={aiError?.message || transcriptError?.message || ''}
      />
    </FormProvider>
  )
}
