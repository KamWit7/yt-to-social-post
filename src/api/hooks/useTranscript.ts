import { ApiResponse } from '@/types'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  getTranscript,
  TranscriptResponse,
} from '../services/transcriptService'

export const getTranscriptQueryKey = (url?: string) =>
  url ? ['transcript', url] : ['transcript']

export function useTranscript(
  url: string | null,
  options?: Partial<UseQueryOptions<ApiResponse<TranscriptResponse>>>
) {
  return useQuery<ApiResponse<TranscriptResponse>>({
    ...options,
    queryKey: getTranscriptQueryKey(url ?? ''),
    queryFn: () => getTranscript(url as string),
    enabled: Boolean(url) && (options?.enabled ?? true),
  })
}
