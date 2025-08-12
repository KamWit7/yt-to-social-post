import { TranscriptResponse } from '../../types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export async function getTranscript(url: string): Promise<TranscriptResponse> {
  return apiFetch<TranscriptResponse>(endpoints.transcript.byUrl(url))
}
