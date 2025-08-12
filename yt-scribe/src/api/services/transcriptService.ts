import { ApiResponse } from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export interface TranscriptResponse {
  transcript?: string
  title?: string
  description?: string
  error?: string
}

export async function getTranscript(
  url: string
): Promise<ApiResponse<TranscriptResponse>> {
  const response = await apiFetch<ApiResponse<TranscriptResponse>>(
    endpoints.transcript.byUrl(url)
  )

  return response
}
