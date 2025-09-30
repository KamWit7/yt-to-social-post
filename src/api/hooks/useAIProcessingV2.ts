import { PurposeValue } from '@/app/api/dictionaries'
import { ProcessTranscriptRequest } from '@/app/api/result/ai.validations'
import { useState } from 'react'

export type AIProcessingV2Response = Record<PurposeValue, string | undefined>

export type AIProcessingV2Error = Record<PurposeValue, string>
export type AIProcessingV2Success = Record<PurposeValue, boolean> | null
export type AIProcessingV2Loading = Record<PurposeValue, boolean | undefined>

// Helper function to check if any purpose is loading
export function isAnyPurposeLoading(loadingState?: AIProcessingV2Loading) {
  if (!loadingState) return false
  return Object.values(loadingState).some((loading) => loading === true)
}

export function isAllPurposeSuccess(successState?: AIProcessingV2Success) {
  if (!successState) {
    return false
  }

  return Object.values(successState).every((success) => success === true)
}

export interface UseAIProcessingV2Return {
  isLoading: AIProcessingV2Loading | undefined
  response: AIProcessingV2Response | undefined
  error: AIProcessingV2Error | undefined
  processTranscript: (
    purpose: PurposeValue,
    data: ProcessTranscriptRequest
  ) => Promise<void>
  isSuccess: AIProcessingV2Success
  reset: () => void
  resetByPurpose: (purpose: PurposeValue) => void
}

export function useAIProcessingV2(): UseAIProcessingV2Return {
  const [isLoading, setIsLoading] = useState<AIProcessingV2Loading>()
  const [response, setResponse] = useState<AIProcessingV2Response>()
  const [error, setError] = useState<AIProcessingV2Error>()
  const [isSuccess, setIsSuccess] = useState<AIProcessingV2Success>(null)

  const setErrorForPurpose = (purpose: PurposeValue, errorMessage: string) => {
    setError(
      (error) => ({ ...error, [purpose]: errorMessage } as AIProcessingV2Error)
    )
  }

  const setSuccessForPurpose = (purpose: PurposeValue, success: boolean) => {
    setIsSuccess(
      (successState) =>
        ({ ...successState, [purpose]: success } as AIProcessingV2Success)
    )
  }

  const clearErrorForPurpose = (purpose: PurposeValue) => {
    setError(
      (error) => ({ ...error, [purpose]: undefined } as AIProcessingV2Error)
    )
  }

  const setLoadingForPurpose = (purpose: PurposeValue, loading: boolean) => {
    setIsLoading(
      (loadingState) =>
        ({ ...loadingState, [purpose]: loading } as AIProcessingV2Loading)
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
              const parsed = JSON.parse(data)

              setResponse((currentResponse) => {
                if (!currentResponse) {
                  return { [purpose]: parsed.text } as AIProcessingV2Response
                }

                return {
                  ...currentResponse,
                  [purpose]: (currentResponse[purpose] ?? '') + parsed.text,
                }
              })
            } catch {
              throw new Error(`Parsing error: ${data}`)
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
      return { ...response, [purpose]: undefined } as AIProcessingV2Response
    })

    setError(
      (error) => ({ ...error, [purpose]: undefined } as AIProcessingV2Error)
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
