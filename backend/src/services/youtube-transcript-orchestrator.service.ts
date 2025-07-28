import { YouTubeParser } from '../parsers/youtube-parser'
import { Utils } from '../puppetieer/youtube/Utils'
import { TranscriptRequestBody } from '../types/youtube.types'
import { Logger } from '../utils/logger'
import { TranscriptService } from './transcript.service'
import { YouTubeFetcher } from './youtube-fetcher.service'

/**
 * Service class that coordinates all YouTube transcript operations
 */
export class YouTubeTranscriptOrchestratorService {
  /**
   * Main method for fetching YouTube transcript
   */
  async getTranscript(youtubeUrl: string): Promise<{
    success: boolean
    transcript?: string
    error?: string
  }> {
    try {
      // URL validation
      if (!YouTubeFetcher.isValidYouTubeUrl(youtubeUrl)) {
        return {
          success: false,
          error: 'Invalid YouTube URL',
        }
      }

      // 1. Fetch YouTube page HTML
      const html = await YouTubeFetcher.fetchPage(youtubeUrl)
      if (!html) {
        return {
          success: false,
          error: 'Failed to fetch YouTube page',
        }
      }

      Logger.info(`Fetched HTML page (${html.length} characters)`)

      // 2. Extract data from HTML
      const extractedData = YouTubeParser.extractDataFromHtml(html)

      if (extractedData.transcriptParams) {
        Logger.result('Found transcript parameters directly in HTML!')
      } else {
        Logger.warning('No transcript parameters found in HTML')
      }

      // 3. Verify we have all required data
      const { transcriptParams, context, videoId } = extractedData

      if (!transcriptParams || !context || !videoId) {
        return {
          success: false,
          error: 'Failed to extract transcript parameters from HTML',
        }
      }

      Logger.success('Found transcript parameters:')
      Logger.info(`   API URL: ${transcriptParams.apiUrl}`)
      Logger.info(`   Params: ${transcriptParams.params.substring(0, 50)}...`)
      Logger.info(`   Video ID: ${videoId}`)

      // 4. Prepare YouTube API request
      const requestBody: TranscriptRequestBody = {
        context,
        params: transcriptParams.params,
        externalVideoId: videoId,
      }

      Logger.progress(`Fetching transcript for video: ${videoId}`)

      // 5. Fetch transcript from YouTube API
      const transcriptData = await TranscriptService.fetchTranscript(
        transcriptParams.apiUrl,
        requestBody,
        youtubeUrl
      )

      if (!transcriptData) {
        TranscriptService.displayErrorReasons()
        return {
          success: false,
          error: 'Failed to fetch transcript from YouTube API',
        }
      }

      Logger.success('Received transcript data!')

      // 6. Format transcript
      const formattedResponse = Utils.formatTranscriptResponse(
        transcriptData,
        'title',
        'description'
      )

      const transcript = formattedResponse.transcript

      if (!transcript) {
        return {
          success: false,
          error: 'Failed to format transcript',
        }
      }

      // 7. Display transcript info
      TranscriptService.displayTranscriptInfo(transcriptData)

      Logger.info('--- Transcript fragment ---')
      Logger.info(transcript.substring(0, 1000) + '...')

      return {
        success: true,
        transcript,
      }
    } catch (error) {
      Logger.error('Unexpected error in orchestrator:', error as Error)
      return {
        success: false,
        error: `Unexpected error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      }
    }
  }

  /**
   * Helper method for testing a single URL with logging
   */
  async testUrl(youtubeUrl: string): Promise<void> {
    Logger.info('🚀 YouTube Transcript Fetcher Demo\n')

    const result = await this.getTranscript(youtubeUrl)

    if (result.success) {
      Logger.success('✅ Successfully fetched transcript!')
      Logger.info(
        `📝 Transcript length: ${result.transcript?.length} characters`
      )
    } else {
      Logger.error(`❌ Error: ${result.error}`)
    }
  }
}
