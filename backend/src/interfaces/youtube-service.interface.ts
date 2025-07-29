import { TranscriptRequestBody } from '../types/youtube.types'

/**
 * Interface for YouTube service operations
 */
export interface IYouTubeService {
  // URL & Page operations
  isValidYouTubeUrl(url: string): boolean
  extractVideoIdFromUrl(url: string): string | null
  fetchPage(youtubeUrl: string): Promise<string | null>

  // Transcript operations
  fetchTranscript(
    apiUrl: string,
    body: TranscriptRequestBody,
    refererUrl: string
  ): Promise<any | null>

  // Validation & diagnostics
  hasTranscriptData(transcriptData: any): boolean
  displayTranscriptInfo(transcriptData: any): void
  displayErrorReasons(): void
}
