import type { DescriptionResponse } from '../types/youtube'
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

    // Przykłady innych opcji formatowania:
    //
    // Dla zwykłego tekstu bez znaków nowej linii:
    // return {
    //   segmentSeparator: ' ',
    //   preserveNewlines: false
    // }
    //
    // Dla tekstu z separatorami między segmentami:
    // return {
    //   segmentSeparator: ' | ',
    //   preserveNewlines: false
    // }
  }

  private static formatTranscriptResponse(
    transcriptData: any
  ): TranscriptResult {
    if (!transcriptData) {
      return { transcript: ERROR_MESSAGES.TRANSCRIPT_NOT_FOUND }
    }

    try {
      // Sprawdź czy otrzymane dane mają strukturę transkrypcji YouTube
      if (isValidTranscriptResponse(transcriptData)) {
        const extractedText = extractTranscriptText(
          transcriptData,
          this.getTranscriptFormatOptions()
        )
        return { transcript: extractedText }
      } else {
        console.warn(
          'Received data does not match expected YouTube transcript structure'
        )
        return { transcript: ERROR_MESSAGES.TRANSCRIPT_FORMAT_NOT_RECOGNIZED }
      }
    } catch (error) {
      console.error('Error processing transcript data:', error)
      return { transcript: ERROR_MESSAGES.TRANSCRIPT_PROCESSING_ERROR }
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
      await puppeteer.wait(500)
      await puppeteer.expandDescriptionUntilTranscriptVisible()
      await puppeteer.showTranscript()

      const transcriptData = await puppeteer.waitForTranscriptResponse()
      return this.formatTranscriptResponse(transcriptData)
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

  static async getDescription(url: string): Promise<DescriptionResponse> {
    this.validateUrl(url)

    try {
      return { description: 'test' }
    } catch (error) {
      throw new Error(
        `Failed to fetch description: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  static async getVideoInfo(url: string) {
    this.validateUrl(url)

    try {
      return {
        title: 'test',
        author: 'test',
        lengthSeconds: 'test',
        viewCount: 'test',
        videoId: 'test',
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch video info: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  static async getCaptionsList(url: string) {
    this.validateUrl(url)

    try {
      return []
    } catch (error) {
      throw new Error(
        `Failed to fetch captions list: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
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
