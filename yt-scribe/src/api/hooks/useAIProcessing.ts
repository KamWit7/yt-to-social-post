import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AIProcessingRequest, AIProcessingResponse } from '../../types'
import { processWithAI } from '../services/aiProcessingService'

export function useAIProcessing(
  options?: Partial<
    UseMutationOptions<AIProcessingResponse, Error, AIProcessingRequest>
  >
) {
  return useMutation<AIProcessingResponse, Error, AIProcessingRequest>({
    ...options,
    mutationFn: processWithAI,
  })
}
