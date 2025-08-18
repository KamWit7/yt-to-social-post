'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { useTranscript } from '@/api/hooks/useTranscript'
import { useCallback, useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { DEFAULT_VALUES, FORM_FIELD_NAMES } from '../constants/formConstants'
import { TranscriptionFormData } from '../types/formTypes'

export interface UseTranscriptionFormControllerParams {
  onTranscriptChange?: (transcript: string) => void
  onTranscriptSuccess?: () => void
  externalTranscript?: string
}

export interface UseTranscriptionFormControllerReturn {
  methods: UseFormReturn<TranscriptionFormData>
  isTranscriptLoading: boolean
  isAIProcessing: boolean
  aiError: Error | null
  transcriptError: Error | null
  onSubmit: (data: TranscriptionFormData) => void
  fetchTranscript: () => void
  canFetchTranscript: boolean
}

export function useTranscriptionFormController(
  params: UseTranscriptionFormControllerParams = {}
): UseTranscriptionFormControllerReturn {
  const { onTranscriptChange, onTranscriptSuccess, externalTranscript } = params

  const [url, setUrl] = useState('')

  const methods = useForm<TranscriptionFormData>({
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  })

  const { watch, setValue } = methods

  const watchedUrl = watch(FORM_FIELD_NAMES.URL)

  // Auto-load external transcript into form
  useEffect(() => {
    if (externalTranscript && externalTranscript.trim().length > 0) {
      setValue(FORM_FIELD_NAMES.TRANSCRIPT, externalTranscript)
    }
  }, [externalTranscript, setValue])

  const {
    data: transcriptResponse,
    isLoading: isTranscriptLoading,
    error: transcriptError,
    refetch: refetchTranscript,
    isSuccess: isTranscriptSuccess,
  } = useTranscript(url, {
    enabled: false,
    retry: 2,
  })

  useEffect(() => {
    if (
      isTranscriptSuccess &&
      transcriptResponse?.success &&
      transcriptResponse.data?.transcript
    ) {
      const transcript = transcriptResponse.data.transcript
      setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcript)
      if (onTranscriptChange) {
        onTranscriptChange(transcript)
      }
      // Call success callback to trigger tab change
      if (onTranscriptSuccess) {
        onTranscriptSuccess()
      }
    }
  }, [
    isTranscriptSuccess,
    transcriptResponse,
    setValue,
    onTranscriptChange,
    onTranscriptSuccess,
  ])

  const fetchTranscript = useCallback(async () => {
    const currentUrl = methods.getValues(FORM_FIELD_NAMES.URL)
    if (!currentUrl || currentUrl.trim() === '') {
      return
    }

    setUrl(currentUrl)

    await refetchTranscript()
  }, [methods, refetchTranscript])

  const canFetchTranscript = Boolean(watchedUrl && watchedUrl.trim() !== '')

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
    fetchTranscript,
    canFetchTranscript,
  }
}
