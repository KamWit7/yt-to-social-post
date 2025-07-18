import { isValidUrl } from '../utils/validation'
import { YoutubePuppeteer } from './youtube/YoutubePuppeteer'
import { ERROR_MESSAGES, ErrorHandler } from './youtube/errors'
import {
  extractTranscriptText,
  isValidTranscriptResponse,
  TranscriptFormatOptions,
} from './youtube/transcriptParser'
import type { TranscriptResult } from './youtube/types'

export class YouTubeService {
  constructor(public puppeteer: YoutubePuppeteer) {}

  private static validateUrl(url: string): void {
    const isValid = isValidUrl(url)
    if (!isValid) {
      ErrorHandler.handleValidationError('Invalid YouTube URL', url)
    }
  }

  private static getTranscriptFormatOptions(): TranscriptFormatOptions {
    return {
      segmentSeparator: ' ',
      preserveNewlines: true,
    }
  }

  private static formatTranscriptResponse(
    transcriptData: unknown,
    title?: string | null,
    description?: string | null
  ): TranscriptResult {
    const parsedTitle = title ?? ERROR_MESSAGES.TITLE_NOT_FOUND
    const parsedDescription =
      description ?? ERROR_MESSAGES.DESCRIPTION_NOT_FOUND

    if (!transcriptData) {
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_NOT_FOUND,
        title: parsedTitle,
        description: parsedDescription,
      }
    }

    try {
      if (isValidTranscriptResponse(transcriptData)) {
        const extractedText = extractTranscriptText(
          transcriptData,
          this.getTranscriptFormatOptions()
        )
        return {
          transcript: extractedText,
          title: parsedTitle,
          description: parsedDescription,
        }
      } else {
        console.warn(
          'Received data does not match expected YouTube transcript structure'
        )
        return {
          transcript: ERROR_MESSAGES.TRANSCRIPT_FORMAT_NOT_RECOGNIZED,
          title: parsedTitle,
          description: parsedDescription,
        }
      }
    } catch (error) {
      console.error('Error processing transcript data:', error)
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_PROCESSING_ERROR,
        title: parsedTitle,
        description: parsedDescription,
      }
    }
  }

  async getTranscript(url: string) {
    try {
      YouTubeService.validateUrl(url)

      await this.puppeteer.initializeBrowser()
      await this.puppeteer.navigateToVideo(url)
      await this.puppeteer.setupResponseInterception()

      await this.puppeteer.handleCookieConsent()
      const isTranscriptVisible =
        await this.puppeteer.expandDescriptionUntilTranscriptVisible()

      const title = await this.puppeteer.getTitle()
      const description = await this.puppeteer.getDescription()

      let transcriptData: unknown

      if (isTranscriptVisible) {
        await this.puppeteer.showTranscript()
        transcriptData = await this.puppeteer.waitForTranscriptResponse()
      }

      return YouTubeService.formatTranscriptResponse(
        transcriptData,
        title,
        description
      )
    } catch (error) {
      throw new Error(
        `Failed to fetch transcript: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      await this.puppeteer.closeBrowser()
    }
  }

  async takeScreenshot(url: string, path: string = 'screenshot.png') {
    try {
      YouTubeService.validateUrl(url)

      await this.puppeteer.initializeBrowser({ headless: true })
      await this.puppeteer.navigateToVideo(url)
      return await this.puppeteer.takeScreenshot(path)
    } catch (error) {
      throw new Error(
        `Failed to take screenshot: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      await this.puppeteer.closeBrowser()
    }
  }
}
