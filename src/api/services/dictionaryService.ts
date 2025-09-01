import { ApiResponse } from '@/types'
import { endpoints } from '../endpoints'
import { apiFetch } from '../httpClient'

export const DictionaryCode = {
  Purpose: 'purpose',
  Language: 'language',
} as const

export type DictionaryCode =
  (typeof DictionaryCode)[keyof typeof DictionaryCode]

export type DictionaryItem = {
  code: string
  label: string
}

export type DictionaryResponse = DictionaryItem[]

export async function getDictionary(
  code: DictionaryCode
): Promise<ApiResponse<DictionaryResponse>> {
  const response = await apiFetch<ApiResponse<DictionaryResponse>>(
    endpoints.dictionary.byCode(code)
  )

  return response
}
