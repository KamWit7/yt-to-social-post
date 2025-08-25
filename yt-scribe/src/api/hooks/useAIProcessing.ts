import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import {
  AIProcessingRequest,
  AIProcessingResponse,
  ApiResponse,
} from '../../types'
import { processWithAI } from '../services/aiProcessingService'

export const getAIProcessingQueryKey = (transcript?: string) => [
  'ai-processing',
  transcript ? transcript.slice(0, 100) : Date.now(),
]

export function useAIProcessing(
  transcript?: string,
  options?: Partial<
    UseMutationOptions<
      ApiResponse<AIProcessingResponse>,
      Error,
      AIProcessingRequest
    >
  >
) {
  return useMutation<
    ApiResponse<AIProcessingResponse>,
    Error,
    AIProcessingRequest
  >({
    ...options,
    mutationKey: getAIProcessingQueryKey(transcript),
    mutationFn: processWithAI,
  })
}
