import {
  TranscriptParams,
  YouTubeContext,
  YouTubeExtractedData,
} from '../types/youtube.types'
import { YOUTUBE_CONSTANTS } from '../utils/constants'
import { ErrorHandler, Logger } from '../utils/logger'

/**
 * YouTube HTML parser for extracting data from page source
 */
export class YouTubeParser {
  /**
   * Extracts YouTube data from HTML page source
   */
  static extractDataFromHtml(html: string): YouTubeExtractedData {
    try {
      const ytcfg = this.extractYtcfg(html)
      const videoId = this.extractVideoId(html)
      const transcriptParams = this.extractTranscriptParams(html)
      const context = this.buildYouTubeContext(ytcfg, videoId)
      const title = this.extractTitle(html)
      const description = this.extractDescription(html)

      const result: YouTubeExtractedData = {}

      if (context) result.context = context
      if (transcriptParams) result.transcriptParams = transcriptParams
      if (videoId) result.videoId = videoId
      if (title) result.title = title
      if (description) result.description = description
      return result
    } catch (error) {
      ErrorHandler.handleParsingError(error, 'extracting data from HTML')
      return {}
    }
  }

  /**
   * Extracts ytcfg from HTML
   */
  private static extractYtcfg(html: string): any {
    const match = html.match(YOUTUBE_CONSTANTS.REGEX.YTCFG)
    if (match) {
      try {
        return JSON.parse(match?.[1] ?? '')
      } catch (error) {
        Logger.warning('Failed to parse ytcfg')
        return null
      }
    }
    return null
  }

  /**
   * Extracts video ID from HTML
   */
  private static extractVideoId(html: string): string {
    const match = html.match(YOUTUBE_CONSTANTS.REGEX.VIDEO_ID)
    return match ? match[1] || match[2] || '' : ''
  }

  /**
   * Extracts transcript parameters from HTML
   */
  private static extractTranscriptParams(
    html: string
  ): TranscriptParams | undefined {
    const transcriptMatch = html.match(
      YOUTUBE_CONSTANTS.REGEX.TRANSCRIPT_ENDPOINT
    )
    const apiUrlMatch = html.match(YOUTUBE_CONSTANTS.REGEX.API_URL)

    if (transcriptMatch && apiUrlMatch) {
      return {
        apiUrl: apiUrlMatch?.[1] ?? '',
        params: transcriptMatch?.[1] ?? '',
      }
    }

    return undefined
  }

  /**
   * Extracts video title from HTML
   */
  private static extractTitle(html: string): string {
    const match = html.match(YOUTUBE_CONSTANTS.REGEX.TITLE)
    if (match) {
      // Try to get title from og:title first, then fallback to <title> tag
      const title = match[2] || match[1] || ''
      // Clean up the title by removing " - YouTube" suffix if present
      return title.replace(/\s*-\s*YouTube\s*$/, '').trim()
    }
    return ''
  }

  /**
   * Extracts video description from HTML
   */
  private static extractDescription(html: string): string {
    const match = html.match(YOUTUBE_CONSTANTS.REGEX.DESCRIPTION)
    if (match) {
      // Try to get description from og:description first, then fallback to meta description
      const description = match[2] || match[1] || ''
      return description.trim()
    }
    return ''
  }

  /**
   * Builds YouTube context based on page data
   */
  private static buildYouTubeContext(
    ytcfg: any,
    videoId: string
  ): YouTubeContext | undefined {
    if (!ytcfg) {
      Logger.warning('No ytcfg data - cannot build context')
      return undefined
    }

    try {
      const clientName = ytcfg.INNERTUBE_CONTEXT?.client?.clientName || 'WEB'
      const clientVersion =
        ytcfg.INNERTUBE_CONTEXT?.client?.clientVersion ||
        YOUTUBE_CONSTANTS.CLIENT.VERSION
      const visitorData =
        ytcfg.VISITOR_DATA || ytcfg.INNERTUBE_CONTEXT?.client?.visitorData

      const context: YouTubeContext = {
        client: {
          clientName,
          clientVersion,
          hl:
            ytcfg.INNERTUBE_CONTEXT?.client?.hl ||
            YOUTUBE_CONSTANTS.DEFAULT_VALUES.LOCALE,
          gl:
            ytcfg.INNERTUBE_CONTEXT?.client?.gl ||
            YOUTUBE_CONSTANTS.DEFAULT_VALUES.COUNTRY,
          visitorData,
          userAgent: YOUTUBE_CONSTANTS.CLIENT.USER_AGENT,
          originalUrl: `${YOUTUBE_CONSTANTS.API.BASE_URL}/watch?v=${videoId}`,
        },
        user: {
          lockedSafetyMode: false,
        },
        request: {
          useSsl: true,
          internalExperimentFlags: [],
          consistencyTokenJars: [],
        },
      }

      // Add additional client data if available
      if (ytcfg.INNERTUBE_CONTEXT?.client) {
        const client = ytcfg.INNERTUBE_CONTEXT.client
        Object.assign(context.client, {
          remoteHost: client.remoteHost,
          screenPixelDensity: client.screenPixelDensity || 1,
          platform:
            client.platform || YOUTUBE_CONSTANTS.DEFAULT_VALUES.PLATFORM,
          clientFormFactor:
            client.clientFormFactor ||
            YOUTUBE_CONSTANTS.DEFAULT_VALUES.CLIENT_FORM_FACTOR,
        })
      }

      Logger.success(
        'Successfully extracted authentic YouTube context from HTML'
      )
      return context
    } catch (error) {
      ErrorHandler.handleParsingError(error, 'building YouTube context')
      return undefined
    }
  }
}
