import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  DictionaryCode,
  DictionaryResponse,
  getDictionary,
} from '../services/dictionaryService'

export const getDictionaryQueryKey = (code?: DictionaryCode) =>
  code ? ['dictionary', code] : ['dictionary']

export function useDictionary(
  code?: DictionaryCode,
  options?: Partial<UseQueryOptions<DictionaryResponse>>
) {
  return useQuery<DictionaryResponse>({
    ...options,
    queryKey: getDictionaryQueryKey(code),
    queryFn: () => getDictionary(code ?? ('' as DictionaryCode)),
    enabled: Boolean(code) && (options?.enabled ?? true),
  })
}
