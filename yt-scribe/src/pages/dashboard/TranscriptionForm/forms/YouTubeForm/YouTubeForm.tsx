'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import type {
  TranscriptionFormData,
  YouTubeFormData,
} from '../../types/formTypes'
import { youtubeSchema } from './youtubeSchema'
import { YouTubeSection } from './YouTubeSection'

type YouTubeFormProps = {
  methods: UseFormReturn<TranscriptionFormData>
  isLoading: boolean
  isTranscriptLoading?: boolean
  onFetchTranscript?: () => void
  canFetchTranscript?: boolean
  transcriptError?: Error | null
}

export function YouTubeForm({
  methods,
  isLoading,
  isTranscriptLoading,
  onFetchTranscript,
  transcriptError,
}: YouTubeFormProps) {
  const localMethods = useForm<YouTubeFormData>({
    resolver: zodResolver(youtubeSchema),
    mode: 'onChange',
    defaultValues: { url: methods.getValues(FORM_FIELD_NAMES.URL) || '' },
  })

  const handleFetchWithValidation = async () => {
    const isValid = await localMethods.trigger()
    if (!isValid) return
    const url = localMethods.getValues(FORM_FIELD_NAMES.URL as 'url')
    methods.setValue(FORM_FIELD_NAMES.URL as 'url', url)
    onFetchTranscript?.()
  }

  const localCanFetchTranscript = Boolean(
    (localMethods.watch(FORM_FIELD_NAMES.URL as 'url') || '').trim()
  )

  return (
    <FormProvider {...methods}>
      <form className='space-y-4'>
        <div className='space-y-12'>
          <FormProvider {...localMethods}>
            <YouTubeSection
              isLoading={isLoading}
              isTranscriptLoading={isTranscriptLoading}
              onFetchTranscript={handleFetchWithValidation}
              canFetchTranscript={localCanFetchTranscript}
              transcriptError={transcriptError}
            />
          </FormProvider>
        </div>
      </form>
    </FormProvider>
  )
}
