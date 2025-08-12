'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { useTranscript } from '@/api/hooks/useTranscript'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { DEFAULT_VALUES, FORM_FIELD_NAMES } from '../constants/formConstants'
import { transcriptionSchema } from '../schemas/transcriptionSchema'
import { TranscriptionFormData } from '../types/formTypes'

export interface UseTranscriptionFormControllerParams {
  onTranscriptChange?: (transcript: string) => void
}

export interface UseTranscriptionFormControllerReturn {
  methods: UseFormReturn<TranscriptionFormData>
  isTranscriptLoading: boolean
  isAIProcessing: boolean
  aiError: Error | null
  transcriptError: Error | null
  onSubmit: (data: TranscriptionFormData) => void
}

export function useTranscriptionFormController(
  params: UseTranscriptionFormControllerParams = {}
): UseTranscriptionFormControllerReturn {
  const { onTranscriptChange } = params

  const [url, setUrl] = useState('')

  const methods = useForm<TranscriptionFormData>({
    resolver: zodResolver(transcriptionSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const { watch, setValue } = methods

  const watchedUrl = watch(FORM_FIELD_NAMES.URL)

  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    error: transcriptError,
  } = useTranscript(url, {
    enabled: !!url,
    retry: 2,
  })

  useEffect(() => {
    if (transcriptData?.success && transcriptData.data?.transcript) {
      setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcriptData.data.transcript)
      if (onTranscriptChange) {
        onTranscriptChange(transcriptData.data.transcript)
      }
    }
  }, [transcriptData, setValue, onTranscriptChange])

  useEffect(() => {
    if (watchedUrl && watchedUrl !== url) {
      setUrl(watchedUrl)
    }
  }, [watchedUrl, url])

  const {
    mutate: processAI,
    isPending: isAIProcessing,
    error: aiError,
  } = useAIProcessing()

  const onSubmit = useCallback(
    async (data: TranscriptionFormData) => {
      processAI({
        transcript: data[FORM_FIELD_NAMES.TRANSCRIPT],
        purpose: data[FORM_FIELD_NAMES.PURPOSE],
        customPurpose: data[FORM_FIELD_NAMES.CUSTOM_PURPOSE],
        options: data.options,
      })
    },
    [processAI]
  )

  return {
    methods,
    isTranscriptLoading,
    isAIProcessing,
    aiError: (aiError as Error) ?? null,
    transcriptError: (transcriptError as Error) ?? null,
    onSubmit,
  }
}
