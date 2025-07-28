import { YouTubeTranscriptOrchestratorService } from './src/services/youtube-transcript-orchestrator.service'

/**
 * Demo YouTube URL for testing
 */
const DEMO_YOUTUBE_URL =
  'https://www.youtube.com/watch?v=-rum7-nCrLQ&ab_channel=AsmongoldTV'

/**
 * Main function to demonstrate YouTube transcript fetching
 */
async function main(): Promise<void> {
  const orchestratorService = new YouTubeTranscriptOrchestratorService()
  await orchestratorService.testUrl(DEMO_YOUTUBE_URL)
}

// Run only if file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error)
}

// Export for use in other modules
export { YouTubeTranscriptOrchestratorService }
