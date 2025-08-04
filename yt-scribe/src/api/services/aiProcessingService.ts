import { AIProcessingRequest, AIProcessingResponse } from '../../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function processWithAI(
  data: AIProcessingRequest
): Promise<AIProcessingResponse> {
  const apiUrl = `${API_BASE_URL}/api/process`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: AIProcessingResponse = await response.json()

  if (!result.success) {
    throw new Error(result.error || 'Wystąpił błąd podczas przetwarzania AI')
  }

  return result
}
