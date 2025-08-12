import { IYouTubeTranscriptOrchestrator } from '../interfaces/youtube-orchestrator.interface'
import { IYouTubeService } from '../interfaces/youtube-service.interface'
import { TranscriptParser } from '../parsers/transcript-parser'
import { YouTubeParser } from '../parsers/youtube-parser'
import { ApiResponse } from '../types/api.types'
import { TranscriptData, TranscriptRequestBody } from '../types/youtube.types'
import { Logger } from '../utils/logger'

/**
 * Service class that coordinates all YouTube transcript operations
 */
export class YouTubeTranscriptOrchestratorService
  implements IYouTubeTranscriptOrchestrator
{
  constructor(private readonly youtubeService: IYouTubeService) {}
  /**
   * Main method for fetching YouTube transcript
   */
  async getTranscript(
    youtubeUrl: string
  ): Promise<ApiResponse<TranscriptData>> {
    try {
      // URL validation
      if (!this.youtubeService.isValidYouTubeUrl(youtubeUrl)) {
        return {
          success: false,
          error: 'Invalid YouTube URL',
        }
      }

      // 1. Fetch YouTube page HTML
      const html = await this.youtubeService.fetchPage(youtubeUrl)
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
      const transcriptData = await this.youtubeService.fetchTranscript(
        transcriptParams.apiUrl,
        requestBody,
        youtubeUrl
      )

      if (!transcriptData) {
        this.youtubeService.displayErrorReasons()
        return {
          success: false,
          error: 'Failed to fetch transcript from YouTube API',
        }
      }

      Logger.success('Received transcript data!')

      // 6. Format transcript
      const formattedResponse = TranscriptParser.formatTranscriptResponse(
        transcriptData,
        extractedData.title,
        extractedData.description
      )

      if (!formattedResponse.transcript) {
        return {
          success: false,
          error: 'Failed to format transcript',
        }
      }

      // 7. Display transcript info
      this.youtubeService.displayTranscriptInfo(transcriptData)

      Logger.info('--- Transcript fragment ---')
      Logger.info(formattedResponse.transcript.substring(0, 1000) + '...')

      return {
        success: true,
        data: {
          transcript: formattedResponse.transcript,
          title: formattedResponse.title,
          description: formattedResponse.description,
        },
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
}
