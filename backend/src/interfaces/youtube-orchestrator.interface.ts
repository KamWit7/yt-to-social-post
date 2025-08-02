/**
 * Interface for YouTube transcript orchestrator operations
 */

export type GetTranscriptReturnType = {
  success: boolean
  transcript?: string
  title?: string
  description?: string
  error?: string
}

export interface IYouTubeTranscriptOrchestrator {
  /**
   * Main method for fetching YouTube transcript
   */
  getTranscript(youtubeUrl: string): Promise<GetTranscriptReturnType>
}
