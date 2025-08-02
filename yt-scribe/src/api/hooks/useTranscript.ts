import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TranscriptResponse } from '../../types'
import { getTranscript } from '../services/transcriptService'

export const getTranscriptQueryKey = (url?: string) =>
  ['transcript', url] as const

export function useTranscript(
  url: string | null,
  options?: Partial<UseQueryOptions<TranscriptResponse>>
) {
  return useQuery<TranscriptResponse>({
    ...options,
    queryKey: getTranscriptQueryKey(url ?? ''),
    queryFn: () => getTranscript(url ?? ''),
  })
}
