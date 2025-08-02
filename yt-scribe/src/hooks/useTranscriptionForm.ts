import { useTranscript } from '@/api/hooks/useTranscript'
import { DEFAULT_FORM_STATE, ERROR_MESSAGES } from '@/utils/constants'
import { isValidYouTubeUrl } from '@/utils/validation'
import { useState } from 'react'

export interface TranscriptionFormState {
  url: string
  purpose: string
  customPurpose: string
  isSubmitted: boolean
}

export interface TranscriptionFormActions {
  setUrl: (url: string) => void
  setPurpose: (purpose: string) => void
  setCustomPurpose: (customPurpose: string) => void
  handleSubmit: () => void
  resetForm: () => void
}

export interface TranscriptionFormData {
  transcript: string
  summary: string
  topics: string[]
  errorMessage: string
}

export function useTranscriptionForm() {
  const [state, setState] = useState<TranscriptionFormState>(DEFAULT_FORM_STATE)

  const { data, isLoading, isError, error } = useTranscript(
    state.isSubmitted ? state.url : ''
  )

  // URL validation
  const isValidUrl = isValidYouTubeUrl(state.url)

  // Computed values with better error handling
  const formData: TranscriptionFormData = (() => {
    const transcript = data?.transcript || ''
    const summary = '' // Placeholder for future implementation
    const topics: string[] = [] // Placeholder for future implementation

    let errorMessage = ''
    if (isError) {
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else {
        errorMessage = ERROR_MESSAGES.TRANSCRIPT_ERROR
      }
    }

    return { transcript, summary, topics, errorMessage }
  })()

  // Actions
  const setUrl = (url: string) => {
    setState((prev) => ({
      ...prev,
      url: url.trim(), // Trim whitespace
      isSubmitted: false, // Reset submission state when URL changes
    }))
  }

  const setPurpose = (purpose: string) => {
    setState((prev) => ({ ...prev, purpose }))
  }

  const setCustomPurpose = (customPurpose: string) => {
    setState((prev) => ({ ...prev, customPurpose: customPurpose.trim() }))
  }

  const handleSubmit = () => {
    if (!isValidUrl) {
      console.warn('Attempted to submit with invalid URL:', state.url)
      return
    }

    setState((prev) => ({ ...prev, isSubmitted: true }))
  }

  const resetForm = () => {
    setState(DEFAULT_FORM_STATE)
  }

  const actions: TranscriptionFormActions = {
    setUrl,
    setPurpose,
    setCustomPurpose,
    handleSubmit,
    resetForm,
  }

  return {
    state,
    actions,
    formData,
    isValidUrl,
    isLoading,
    isError,
  }
}
