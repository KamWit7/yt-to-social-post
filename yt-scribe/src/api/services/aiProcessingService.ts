import { AIProcessingRequest, AIProcessingResponse } from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export async function processWithAI(
  data: AIProcessingRequest
): Promise<AIProcessingResponse> {
  return apiFetch<AIProcessingResponse, AIProcessingRequest>(
    endpoints.ai.processTranscript,
    {
      method: 'POST',
      body: data,
    }
  )
}
