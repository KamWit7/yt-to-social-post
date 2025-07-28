import { ErrorHandler, Logger } from '../utils/logger'

/**
 * Service for fetching YouTube pages and handling URL operations
 */
export class YouTubeFetcher {
  /**
   * Fetches HTML content from YouTube page
   */
  static async fetchPage(youtubeUrl: string): Promise<string | null> {
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

  /**
   * Validates if URL is a valid YouTube link
   */
  static isValidYouTubeUrl(url: string): boolean {
    const youtubeUrlPattern =
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
    return youtubeUrlPattern.test(url)
  }

  /**
   * Extracts video ID from YouTube URL
   */
  static extractVideoIdFromUrl(url: string): string | null {
    const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/)
    return match ? match[1] || null : null
  }
}
