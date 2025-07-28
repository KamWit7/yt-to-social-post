import { TranscriptRequestBody } from '../types/youtube.types'
import { YOUTUBE_CONSTANTS } from '../utils/constants'
import { ErrorHandler, Logger } from '../utils/logger'

/**
 * Service for handling YouTube transcript API operations
 */
export class TranscriptService {
  /**
   * Fetches transcript from YouTube API
   */
  static async fetchTranscript(
    apiUrl: string,
    body: TranscriptRequestBody,
    refererUrl: string
  ): Promise<any | null> {
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
  private static buildHeaders(refererUrl: string): Record<string, string> {
    return {
      'content-type': 'application/json',
      'x-youtube-client-name': YOUTUBE_CONSTANTS.CLIENT.NAME,
      referer: refererUrl,
    }
  }

  /**
   * Checks if response contains transcript data
   */
  static hasTranscriptData(transcriptData: any): boolean {
    return !!(transcriptData?.actions || transcriptData?.contents)
  }

  /**
   * Displays diagnostic information about transcript
   */
  static displayTranscriptInfo(transcriptData: any): void {
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
  static displayErrorReasons(): void {
    Logger.error('Failed to fetch transcript')
    Logger.info('💡 Possible reasons:')
    Logger.info('   - Missing permissions (requires cookies/authentication)')
    Logger.info('   - Invalid parameters')
    Logger.info('   - Video has no transcript available')
    Logger.info('   - Blocked by YouTube (rate limiting)')
  }
}
