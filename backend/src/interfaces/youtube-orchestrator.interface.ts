/**
 * Interface for YouTube transcript orchestrator operations
 */
export interface IYouTubeTranscriptOrchestrator {
  /**
   * Main method for fetching YouTube transcript
   */
  getTranscript(youtubeUrl: string): Promise<{
    success: boolean
    transcript?: string
    error?: string
  }>
}
