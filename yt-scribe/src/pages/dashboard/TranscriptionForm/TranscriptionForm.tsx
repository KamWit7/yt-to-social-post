'use client'

import { useTranscript } from '@/api/hooks/useTranscript'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { SubmitButton } from './components/SubmitButton'
import { transcriptionSchema } from './schemas/transcriptionSchema'
import { TranscriptionFormData } from './types/formTypes'

const DEFAULT_PURPOSE = 'Do nauki'

export default function TranscriptionForm() {
  const [url, setUrl] = useState('')

  const methods = useForm<TranscriptionFormData>({
    resolver: zodResolver(transcriptionSchema),
    mode: 'onChange',
    defaultValues: {
      url: '',
      purpose: DEFAULT_PURPOSE,
      customPurpose: '',
    },
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

  const onSubmit = useCallback((data: TranscriptionFormData) => {
    setUrl(data.url)
  }, [])

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
