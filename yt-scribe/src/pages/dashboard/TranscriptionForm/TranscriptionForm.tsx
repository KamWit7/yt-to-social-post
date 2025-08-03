'use client'

import { useTranscript } from '@/api/hooks/useTranscript'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { DEFAULT_VALUES, FORM_FIELD_NAMES } from './constants/formConstants'
import { transcriptionSchema } from './schemas/transcriptionSchema'
import { TranscriptionFormData } from './types/formTypes'

interface TranscriptionFormProps {
  url: string
  setUrl: (url: string) => void
}

export default function TranscriptionForm({
  url,
  setUrl,
}: TranscriptionFormProps) {
  const methods = useForm<TranscriptionFormData>({
    resolver: zodResolver(transcriptionSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const {
    handleSubmit,
    formState: { isValid },
  } = methods

  const { isLoading: isTranscriptLoading, error: transcriptError } =
    useTranscript(url, {
      enabled: !!url,
      retry: 2,
    })

  const onSubmit = useCallback(
    (data: TranscriptionFormData) => {
      setUrl(data[FORM_FIELD_NAMES.URL])
    },
    [setUrl]
  )

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <FormFields isLoading={isTranscriptLoading} />
        <SubmitButton isLoading={isTranscriptLoading} isValid={isValid} />
      </form>
      <ErrorMessage message={transcriptError?.message || ''} />
    </FormProvider>
  )
}
