import { isValidUrl } from '../utils/validation'
import { YoutubePuppeteer } from './youtube/YoutubePuppeteer'
import { DEFAULT_CONFIG } from './youtube/config'
import { ERROR_MESSAGES, ErrorHandler } from './youtube/errors'
import {
  extractTranscriptText,
  isValidTranscriptResponse,
  TranscriptFormatOptions,
} from './youtube/transcriptParser'
import type { BrowserConfig, TranscriptResult } from './youtube/types'

export class YouTubeService {
  private static validateUrl(url: string): void {
    const isValid = isValidUrl(url)
    if (!isValid) {
      ErrorHandler.handleValidationError('Invalid YouTube URL', url)
    }
  }

  private static getBrowserConfig(): BrowserConfig {
    return DEFAULT_CONFIG
  }

  private static getTranscriptFormatOptions(): TranscriptFormatOptions {
    return {
      segmentSeparator: ' ',
      preserveNewlines: true,
    }
  }

  private static formatTranscriptResponse(
    transcriptData: any,
    title?: string | null,
    description?: string | null
  ): TranscriptResult {
    const defaultTitle = ERROR_MESSAGES.TITLE_NOT_FOUND
    const defaultDescription = ERROR_MESSAGES.DESCRIPTION_NOT_FOUND

    const parsedTitle = title || defaultTitle
    const parsedDescription = description || defaultDescription

    if (!transcriptData) {
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_NOT_FOUND,
        title: defaultTitle,
        description: defaultDescription,
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

  static async getTranscript(url: string) {
    this.validateUrl(url)

    const puppeteer = new YoutubePuppeteer(this.getBrowserConfig())

    try {
      await puppeteer.initializeBrowser()
      await puppeteer.navigateToVideo(url)
      await puppeteer.setupResponseInterception()

      await puppeteer.handleCookieConsent()
      await puppeteer.expandDescriptionUntilTranscriptVisible()

      const title = await puppeteer.getTitle()
      const description = await puppeteer.getDescription()

      await puppeteer.showTranscript()

      const transcriptData = await puppeteer.waitForTranscriptResponse()
      return this.formatTranscriptResponse(transcriptData, title, description)
    } catch (error) {
      throw new Error(
        `Failed to fetch transcript: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      await puppeteer.closeBrowser()
    }
  }

  static async takeScreenshot(url: string, path: string = 'screenshot.png') {
    this.validateUrl(url)

    const puppeteer = new YoutubePuppeteer(this.getBrowserConfig())

    try {
      await puppeteer.initializeBrowser({ headless: true })
      await puppeteer.navigateToVideo(url)
      return await puppeteer.takeScreenshot(path)
    } catch (error) {
      throw new Error(
        `Failed to take screenshot: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    } finally {
      await puppeteer.closeBrowser()
    }
  }
}
