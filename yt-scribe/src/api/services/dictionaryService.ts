import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export const DictionaryCode = {
  Purpose: 'purpose',
} as const

export type DictionaryCode =
  (typeof DictionaryCode)[keyof typeof DictionaryCode]

export type DictionaryItem = {
  code: string
  label: string
}

export type DictionaryResponse = DictionaryItem[]

type DictionaryApiResponse = {
  success: boolean
  data: DictionaryResponse
}

export async function getDictionary(
  code: DictionaryCode
): Promise<DictionaryResponse> {
  const response = await apiFetch<DictionaryApiResponse>(
    endpoints.dictionary.byCode(code)
  )
  return response.data
}
