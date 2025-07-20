import { ErrorHandler } from '../puppetieer/youtube/errors'
import { TranscriptResult } from '../puppetieer/youtube/types'
import { Utils } from '../puppetieer/youtube/Utils'
import { YoutubePuppeteer } from '../puppetieer/youtube/YoutubePuppeteer'

export class YouTubeService {
  constructor(public puppeteer: YoutubePuppeteer) {}

  async getTranscript(url: string): Promise<TranscriptResult> {
    try {
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

      return Utils.formatTranscriptResponse(transcriptData, title, description)
    } catch (error) {
      ErrorHandler.handleTranscriptError(
        `Failed to fetch transcript for url: ${url}`
      )
    } finally {
      await this.puppeteer.closeBrowser()
    }
  }

  async takeScreenshot(url: string, path: string = 'screenshot.png') {
    try {
      await this.puppeteer.initializeBrowser()
      await this.puppeteer.navigateToVideo(url)

      return await this.puppeteer.takeScreenshot(path)
    } catch (error) {
      ErrorHandler.handleScreenshotError(error)
    } finally {
      await this.puppeteer.closeBrowser()
    }
  }
}
