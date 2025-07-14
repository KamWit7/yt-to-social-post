import puppeteer, { Browser, Page } from 'puppeteer'
import { BROWSER_OPTIONS, DEFAULT_CONFIG } from './config'
import { ErrorHandler } from './errors'
import { API_ENDPOINTS, SELECTORS } from './selectors'
import type {
  BrowserConfig,
  PuppeteerLaunchOptions,
  ResponseInterceptionData,
} from './types'

export class YoutubePuppeteer {
  private browser: Browser | null = null
  private page: Page | null = null
  private config: BrowserConfig
  private responseData: ResponseInterceptionData = {
    transcriptData: null,
    transcriptReceived: false,
  }

  constructor(config: Partial<BrowserConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  async wait(timeout: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, timeout))
  }

  async isElementVisible(selector: string): Promise<boolean> {
    if (!this.page) {
      return false
    }

    try {
      const element = await this.page.$(selector)
      if (!element) {
        return false
      }

      const isVisible = await element.isIntersectingViewport()
      return isVisible
    } catch (error) {
      return false
    }
  }

  async initializeBrowser(options?: PuppeteerLaunchOptions): Promise<void> {
    try {
      const launchOptions = {
        ...BROWSER_OPTIONS,
        ...options,
      }

      this.browser = await puppeteer.launch(launchOptions)
      this.page = await this.browser.newPage()

      await this.page.setViewport(this.config.viewport)
    } catch (error) {
      ErrorHandler.handlePuppeteerError(
        error as Error,
        'browser initialization'
      )
    }
  }

  async closeBrowser(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close()
        this.browser = null
        this.page = null
      }
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error as Error, 'browser cleanup')
    }
  }

  async navigateToVideo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      await this.page.goto(url)
      await this.page.waitForSelector(SELECTORS.BODY, {
        timeout: this.config.timeouts.navigation,
      })
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error as Error, 'navigation')
    }
  }

  async setupResponseInterception(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      this.page.on('response', async (response) => {
        const url = response.url()

        if (url.includes(API_ENDPOINTS.TRANSCRIPT)) {
          console.log('Transcript API response intercepted:', url)
          console.log('Response status:', response.status())

          try {
            const responseData = await response.json()
            console.log('Transcript response data:', responseData)
            this.responseData.transcriptData = responseData
            this.responseData.transcriptReceived = true
          } catch (error) {
            console.log('Error parsing transcript response:', error)
            this.responseData.transcriptReceived = true
          }
        }
      })
    } catch (error) {
      ErrorHandler.handlePuppeteerError(
        error as Error,
        'response interception setup'
      )
    }
  }

  async handleCookieConsent(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      const rejectAllButton = await this.page.waitForSelector(
        SELECTORS.COOKIE_CONSENT,
        { timeout: this.config.timeouts.selector }
      )

      if (rejectAllButton) {
        await rejectAllButton.click()
        console.log('Cookie consent rejected')
      }
    } catch (error) {
      console.log('Cookie consent banner not found or already handled')
    }
  }

  async expandDescriptionUntilTranscriptVisible(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    const maxRetries = 3
    let retryCount = 0

    while (retryCount < maxRetries) {
      try {
        const expandButton = await this.page.waitForSelector(
          SELECTORS.EXPAND_BUTTON,
          { timeout: this.config.timeouts.selector }
        )

        if (expandButton) {
          await expandButton.click()
          console.log(`Description expanded (attempt ${retryCount + 1})`)

          await this.wait(1000)
        }

        const isTranscriptVisible = await this.isElementVisible(
          SELECTORS.SHOW_TRANSCRIPT
        )

        if (isTranscriptVisible) {
          console.log('Transcript button is now visible')
          return
        }

        retryCount++
        if (retryCount < maxRetries) {
          console.log(
            `Transcript button not visible, retrying expand (${
              retryCount + 1
            }/${maxRetries})`
          )
          await this.wait(500)
        }
      } catch (error) {
        console.log(
          `Expand button not found or not clickable (attempt ${retryCount + 1})`
        )
        retryCount++
        if (retryCount < maxRetries) {
          await this.wait(500)
        }
      }
    }

    console.log('Max retries reached for expand button')
  }

  async expandDescription(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      const expandButton = await this.page.waitForSelector(
        SELECTORS.EXPAND_BUTTON,
        { timeout: this.config.timeouts.selector }
      )

      if (expandButton) {
        await expandButton.click()
        console.log('Description expanded')
        await this.wait(1000) // Wait for UI to update
      }
    } catch (error) {
      console.log('Expand button not found or not clickable')
    }
  }

  async showTranscript(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    try {
      // First check if transcript button is visible
      const isTranscriptVisible = await this.isElementVisible(
        SELECTORS.SHOW_TRANSCRIPT
      )

      if (!isTranscriptVisible) {
        console.log(
          'Transcript button not visible, trying to expand description...'
        )
        await this.expandDescriptionUntilTranscriptVisible()
      }

      const showTranscriptButton = await this.page.waitForSelector(
        SELECTORS.SHOW_TRANSCRIPT,
        { timeout: this.config.timeouts.selector }
      )

      if (showTranscriptButton) {
        await showTranscriptButton.click()
        console.log('Show transcript button clicked')
      }
    } catch (error) {
      console.log('Show transcript button not found or not clickable')
    }
  }

  async waitForTranscriptResponse(): Promise<any> {
    const maxWaitTime = this.config.timeouts.transcript
    const startTime = Date.now()

    while (
      !this.responseData.transcriptReceived &&
      Date.now() - startTime < maxWaitTime
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    if (this.responseData.transcriptReceived) {
      console.log('Transcript data received successfully')
      return this.responseData.transcriptData
    } else {
      ErrorHandler.handleTimeoutError('transcript response', maxWaitTime)
    }
  }

  async takeScreenshot(path: string): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not initialized')
    }

    // Puppeteer expects the path to end with .png, .jpeg, or .webp
    if (!/\.(png|jpeg|webp)$/.test(path)) {
      throw new Error('Screenshot path must end with .png, .jpeg, or .webp')
    }

    try {
      await this.page.screenshot({
        path: path as `${string}.png` | `${string}.jpeg` | `${string}.webp`,
      })
      return path
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error as Error, 'screenshot capture')
    }
  }

  // Utility method to reset response data for new operations
  resetResponseData(): void {
    this.responseData = {
      transcriptData: null,
      transcriptReceived: false,
    }
  }
}
