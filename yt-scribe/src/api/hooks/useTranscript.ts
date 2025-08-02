import { useQuery } from '@tanstack/react-query'
import { TranscriptResponse } from '../../types'
import { getTranscript } from '../services/transcriptService'

export function useTranscript(url: string) {
  return useQuery<TranscriptResponse>({
    queryKey: ['transcript', url],
    queryFn: () => getTranscript(url),
    enabled: !!url,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minut
  })
}
