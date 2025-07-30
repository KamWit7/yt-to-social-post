import { IYouTubeService } from '../interfaces/youtube-service.interface'
import { YouTubeTranscriptResponse } from '../types/transcript.types'
import { TranscriptRequestBody } from '../types/youtube.types'
import { YOUTUBE_CONSTANTS } from '../utils/constants'
import { ErrorHandler, Logger } from '../utils/logger'
import { extractVideoIdFromUrl, isValidYouTubeUrl } from '../utils/validation'

/**
 * Unified service for all YouTube operations including page fetching and transcript retrieval
 */
export class YouTubeService implements IYouTubeService {
  // ===== URL & PAGE OPERATIONS =====

  /**
   * Validates if URL is a valid YouTube link
   */
  isValidYouTubeUrl(url: string): boolean {
    return isValidYouTubeUrl(url)
  }

  /**
   * Extracts video ID from YouTube URL
   */
  extractVideoIdFromUrl(url: string): string | null {
    return extractVideoIdFromUrl(url)
  }

  /**
   * Fetches HTML content from YouTube page
   */
  async fetchPage(youtubeUrl: string): Promise<string | null> {
    try {
      Logger.progress(`Fetching YouTube page: ${youtubeUrl}`)

      const response = await fetch(youtubeUrl, {
        method: 'GET',
      })

      if (!response.ok) {
        Logger.error(`HTTP Error: ${response.status} ${response.statusText}`)
        return null
      }

      const html = await response.text()

      Logger.success(
        `Successfully fetched YouTube page (${html.length} characters)`
      )

      return html
    } catch (error) {
      ErrorHandler.handleFetchError(error, 'fetching YouTube page')
      return null
    }
  }

  // ===== TRANSCRIPT OPERATIONS =====

  /**
   * Fetches transcript from YouTube API
   */
  async fetchTranscript(
    apiUrl: string,
    body: TranscriptRequestBody,
    refererUrl: string
  ): Promise<YouTubeTranscriptResponse | null | undefined> {
    try {
      const fullUrl = `${YOUTUBE_CONSTANTS.API.BASE_URL}${apiUrl}?prettyPrint=false`

      const headers = this.buildHeaders(refererUrl)

      Logger.progress(`Sending request to: ${fullUrl}`)
      Logger.debug(`Transcript parameters: ${body.params.substring(0, 50)}...`)

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        Logger.error(`HTTP Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        Logger.error(`Error content: ${errorText.substring(0, 500)}`)
        return null
      }

      const data = await response.json()

      Logger.success('Successfully fetched transcript data')

      return data
    } catch (error) {
      ErrorHandler.handleFetchError(error, 'fetching transcript')
      return null
    }
  }

  /**
   * Builds HTTP headers for YouTube API request
   */
  private buildHeaders(refererUrl: string): Record<string, string> {
    return {
      'content-type': 'application/json',
      'x-youtube-client-name': YOUTUBE_CONSTANTS.CLIENT.NAME,
      referer: refererUrl,
    }
  }

  // ===== TRANSCRIPT VALIDATION & DIAGNOSTICS =====

  /**
   * Checks if response contains transcript data
   */
  hasTranscriptData(
    transcriptData: YouTubeTranscriptResponse | null | undefined
  ): boolean {
    return !!transcriptData?.actions
  }

  /**
   * Displays diagnostic information about transcript
   */
  displayTranscriptInfo(
    transcriptData: YouTubeTranscriptResponse | null | undefined
  ): void {
    if (this.hasTranscriptData(transcriptData)) {
      Logger.result('Response contains transcript data')
    } else {
      Logger.warning(
        'Response may not contain transcript or requires additional parameters'
      )
    }
  }

  /**
   * Displays possible error reasons for transcript fetch failure
   */
  displayErrorReasons(): void {
    Logger.error('Failed to fetch transcript')
    Logger.info('💡 Possible reasons:')
    Logger.info('   - Missing permissions (requires cookies/authentication)')
    Logger.info('   - Invalid parameters')
    Logger.info('   - Video has no transcript available')
    Logger.info('   - Blocked by YouTube (rate limiting)')
  }
}
