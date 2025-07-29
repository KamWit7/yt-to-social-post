import { YouTubeTranscriptOrchestratorService } from './src/services/youtube-transcript-orchestrator.service'
import { YouTubeService } from './src/services/youtube.service'
import { Logger } from './src/utils/logger'

/**
 * Demo YouTube URL for testing
 */
const DEMO_YOUTUBE_URL =
  'https://www.youtube.com/watch?v=-rum7-nCrLQ&ab_channel=AsmongoldTV'

/**
 * Main function to demonstrate YouTube transcript fetching
 */
async function main(): Promise<void> {
  // Dependency injection setup
  const youtubeService = new YouTubeService()
  const orchestratorService = new YouTubeTranscriptOrchestratorService(
    youtubeService
  )

  // Test transcript fetching
  Logger.info('🚀 YouTube Transcript Fetcher Demo\n')

  const result = await orchestratorService.getTranscript(DEMO_YOUTUBE_URL)

  if (result.success) {
    Logger.success('✅ Successfully fetched transcript!')
    Logger.info(`📝 Transcript length: ${result.transcript?.length} characters`)
  } else {
    Logger.error(`❌ Error: ${result.error}`)
  }
}

// Run only if file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error)
}

// Export for use in other modules
export { YouTubeTranscriptOrchestratorService }
