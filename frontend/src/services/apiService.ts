import type { DescriptionResponse, TranscriptResponse } from '../types/youtube'

const API_BASE_URL = '/api'

export class ApiService {
  private static async makeRequest<T>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  static async fetchTranscript(url: string): Promise<TranscriptResponse> {
    return this.makeRequest<TranscriptResponse>('/transcript', { url })
  }

  static async fetchDescription(url: string): Promise<DescriptionResponse> {
    return this.makeRequest<DescriptionResponse>('/description', { url })
  }
}
