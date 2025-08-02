import { TranscriptResponse } from '../../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function getTranscript(url: string): Promise<TranscriptResponse> {
  const apiUrl = `${API_BASE_URL}/api/transcript?url=${encodeURIComponent(url)}`

  const response = await fetch(apiUrl)

  const data: TranscriptResponse = await response.json()

  if (!data.success) {
    throw new Error(
      data.error || 'Wystąpił błąd podczas pobierania transkrypcji'
    )
  }

  return data
}
