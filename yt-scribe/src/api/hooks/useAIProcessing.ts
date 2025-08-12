import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import {
  AIProcessingRequest,
  AIProcessingResponse,
  ApiResponse,
} from '../../types'
import { processWithAI } from '../services/aiProcessingService'

export const getAIProcessingQueryKey = () => ['ai-processing']

export function useAIProcessing(
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
    mutationKey: getAIProcessingQueryKey(),
    mutationFn: processWithAI,
  })
}
