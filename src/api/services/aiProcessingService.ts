import {
  AIProcessingRequest,
  AIProcessingResponse,
  ApiResponse,
} from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export async function processWithAI(
  data: AIProcessingRequest
): Promise<ApiResponse<AIProcessingResponse>> {
  const response = await apiFetch<
    ApiResponse<AIProcessingResponse>,
    AIProcessingRequest
  >(endpoints.ai.processTranscript, {
    method: 'POST',
    body: data,
  })

  return response
}
