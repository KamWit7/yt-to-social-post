import { ProcessTranscriptRequest } from '@/app/api/result/ai.validations'
import { PurposeValue } from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { useState } from 'react'

export type AIProcessingResponse = Record<PurposeValue, string | undefined>

export type AIProcessingError = Record<PurposeValue, string | undefined>
type AIProcessingSuccess = Record<PurposeValue, boolean> | null
export type AIProcessingLoading = Record<PurposeValue, boolean | undefined>

// Helper function to check if any purpose is loading
export function isAnyPurposeLoading(loadingState?: AIProcessingLoading) {
  if (!loadingState) return false
  return Object.values(loadingState).some((loading) => loading === true)
}

export function isAllPurposeSuccess(successState?: AIProcessingSuccess) {
  if (!successState) {
    return false
  }

  return Object.values(successState).every((success) => success === true)
}

export interface UseAIProcessingReturn {
  isLoading: AIProcessingLoading | undefined
  response: AIProcessingResponse | undefined
  error: AIProcessingError | undefined
  processTranscript: (
    purpose: PurposeValue,
    data: ProcessTranscriptRequest
  ) => Promise<void>
  isSuccess: AIProcessingSuccess
  reset: () => void
  resetByPurpose: (purpose: PurposeValue) => void
}

export function useAIProcessing(): UseAIProcessingReturn {
  const [isLoading, setIsLoading] = useState<AIProcessingLoading>()
  const [response, setResponse] = useState<AIProcessingResponse>()
  const [error, setError] = useState<AIProcessingError>()
  const [isSuccess, setIsSuccess] = useState<AIProcessingSuccess>(null)

  const setErrorForPurpose = (purpose: PurposeValue, errorMessage: string) => {
    setError(
      (error) => ({ ...error, [purpose]: errorMessage } as AIProcessingError)
    )
  }

  const setSuccessForPurpose = (purpose: PurposeValue, success: boolean) => {
    setIsSuccess(
      (successState) =>
        ({ ...successState, [purpose]: success } as AIProcessingSuccess)
    )
  }

  const clearErrorForPurpose = (purpose: PurposeValue) => {
    setError(
      (error) => ({ ...error, [purpose]: undefined } as AIProcessingError)
    )
  }

  const setLoadingForPurpose = (purpose: PurposeValue, loading: boolean) => {
    setIsLoading(
      (loadingState) =>
        ({ ...loadingState, [purpose]: loading } as AIProcessingLoading)
    )
  }

  const processTranscript = async (
    purpose: PurposeValue,
    data: ProcessTranscriptRequest
  ): Promise<void> => {
    setLoadingForPurpose(purpose, true)
    clearErrorForPurpose(purpose)
    setSuccessForPurpose(purpose, false)

    try {
      const response = await fetch('/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, purpose }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: Unknown error`

        try {
          // Try to parse as JSON first (new error format)
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = errorData.error
          } else {
            errorMessage = `HTTP ${response.status}: ${JSON.stringify(
              errorData
            )}`
          }
        } catch {
          // If JSON parsing fails, try as text (fallback for old format)
          try {
            const errorText = await response.text()
            errorMessage = errorText || `HTTP ${response.status}: Unknown error`
          } catch {
            errorMessage = `HTTP ${response.status}: Unable to parse error`
          }
        }

        setErrorForPurpose(purpose, errorMessage)
        setSuccessForPurpose(purpose, false)
        throw new Error(errorMessage)
      }

      if (!response.body) {
        setErrorForPurpose(purpose, 'No response body')
        setSuccessForPurpose(purpose, false)
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setSuccessForPurpose(purpose, true)
              setLoadingForPurpose(purpose, false)
              clearErrorForPurpose(purpose)
              return
            }
            try {
              //check is stream is endpint with data: [DONE]
              const isDone = data.endsWith('data: [DONE]')
              const safeData = isDone ? data.slice(0, -12) : data
              const parsed = JSON.parse(safeData)

              setResponse((currentResponse) => {
                if (!currentResponse) {
                  return { [purpose]: parsed.text } as AIProcessingResponse
                }

                return {
                  ...currentResponse,
                  [purpose]: (currentResponse[purpose] ?? '') + parsed.text,
                }
              })
              
              if (isDone) {
                setSuccessForPurpose(purpose, true)
                setLoadingForPurpose(purpose, false)
                clearErrorForPurpose(purpose)
              }
            } catch (error) {
              // check if error is parsing error
              // iParsing error: {"text":"Key topics:\n- Lojalność i oddanie w związku\n- Deklaracja głębokich uczuć\n- Obietnica stałości i wsparcia"}data: [DONE]

              // Ignore parsing errors for malformed JSON chunks (e.g., when data and [DONE] are concatenated)
              console.warn('Parsing error for chunk:', data, error)
              // Don't throw error, just continue processing
            }
          }
        }
      }
    } catch (err) {
      setErrorForPurpose(
        purpose,
        err instanceof Error ? err.message : 'An error occurred'
      )
    } finally {
      setLoadingForPurpose(purpose, false)
    }
  }

  const reset = () => {
    setResponse(undefined)
    setError(undefined)
    setIsLoading(undefined)
    setIsSuccess(null)
  }

  const resetByPurpose = (purpose: PurposeValue) => {
    setResponse((response) => {
      if (!response) {
        return response
      }
      return { ...response, [purpose]: undefined } as AIProcessingResponse
    })

    setError(
      (error) => ({ ...error, [purpose]: undefined } as AIProcessingError)
    )
  }

  return {
    isLoading,
    response,
    error,
    processTranscript,
    isSuccess,
    reset,
    resetByPurpose,
  }
}
