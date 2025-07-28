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

      const isVisible = await element.isVisible()

      if (isVisible) {
        await element.scrollIntoView()
      }

      const isIntersectingViewport = await element.isIntersectingViewport()

      return isIntersectingViewport
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
      ErrorHandler.handlePuppeteerError(error, 'browser initialization')
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
      ErrorHandler.handlePuppeteerError(error, 'browser cleanup')
    }
  }

  async navigateToVideo(url: string): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError('Browser not initialized', 'navigation')
    }

    try {
      await this.page.goto(url)
      await this.page.waitForSelector(SELECTORS.BODY, {
        timeout: this.config.timeouts.navigation,
      })
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error, 'navigation to video')
    }
  }

  async setupResponseInterception(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'response interception'
      )
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
      ErrorHandler.handlePuppeteerError(error, 'response interception setup')
    }
  }

  async blockResourceTypes(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'block images loading'
      )
    }

    const BANNED_RESOURCE_TYPES = new Set([
      'image',
      'stylesheet',
      'font',
      'media',
    ])

    try {
      this.page.setRequestInterception(true)

      this.page.on('request', (request) => {
        if (BANNED_RESOURCE_TYPES.has(request.resourceType())) {
          request.abort()
        } else {
          request.continue()
        }
      })
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error, 'block images loading')
    }
  }

  async fetchTranscript(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'fetch transcript'
      )
    }

    const dataFromTranscript = await this.page.evaluate(async () => {
      const response = await fetch(API_ENDPOINTS.TRANSCRIPT, {
        headers: {
          'Content-Type': 'application/json',
          method: 'POST',
          body: JSON.stringify({
            context: {
              client: {
                hl: 'pl',
                gl: 'PL',
                remoteHost: '46.174.215.65',
                deviceMake: '',
                deviceModel: '',
                visitorData:
                  'Cgt2Y3QtY2hhMkdZdyjjkp7EBjInCgJQTBIhEh0SGwsMDg8QERITFBUWFxgZGhscHR4fICEiIyQlJiBd',
                userAgent:
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36,gzip(gfe)',
                clientName: 'WEB',
                clientVersion: '2.20250725.01.00',
                osName: 'Windows',
                osVersion: '10.0',
                originalUrl:
                  'https://www.youtube.com/watch?v=KiFwzaXCypw&ab_channel=Theo-t3%E2%80%A4gg',
                screenPixelDensity: 2,
                platform: 'DESKTOP',
                clientFormFactor: 'UNKNOWN_FORM_FACTOR',
                configInfo: {
                  appInstallData:
                    'COOSnsQGEKSIgBMQvbauBRCUmYATELnZzhwQn6HPHBDyxM8cEMvRsQUQiIewBRDHyM8cELvZzhwQt-r-EhDFw88cEKv4zhwQzMDPHBDDioATEKOvzxwQ8MTPHBCvhs8cENuvrwUQgc_PHBD8zs8cEOq7zxwQndDPHBDa984cEI3MsAUQkdHPHBDFy88cEOHLzxwQzqzPHBCqnc8cEOLKzxwQzN-uBRDi1K4FEJT-sAUQpcvPHBC9mbAFEJ3QsAUQibDOHBCI468FEImXgBMQ8OLOHBC9irAFEIHNzhwQ0-GvBRD2us8cEKCnzxwQieiuBRD2q7AFENfBsQUQuOTOHBDJ968FEJOGzxwQmY2xBRDjvs8cEOevzxwQs5DPHBCHrM4cEJi5zxwQmZixBRCCj88cEMK-zxwQ3rzOHBDN0bEFEOmIzxwQ4M2xBRD7tM8cEIGzzhwQ9svPHBCmmrAFEPyyzhwQkYz_EhCLgoATELfKzxwQqanPHBD4nYATEKy0zxwqQENBTVNLaFVob0wyd0ROSGtCdmJxQU5rN2ktQUxrZDdtQzRPb0FJVERCZV83QnNzZ2d0TUF0Y3dHd1JNZEJ3PT0%3D',
                  coldConfigData:
                    'COOSnsQGEO66rQUQvbauBRDi1K4FEL2KsAUQndCwBRDP0rAFEOP4sAUQpL6xBRDXwbEFEJLUsQUQr6fOHBD8ss4cEIGzzhwQhcrOHBDJ4s4cELSCzxwQr4bPHBCqnc8cELCdzxwQ_Z7PHBCgp88cEKmpzxwQzqzPHBDdrM8cEPWuzxwQo6_PHBCstM8cEIq2zxwQ6rvPHBDjvs8cEMnCzxwQxcPPHBDwxM8cELfGzxwQ-MbPHBDHyM8cEI3JzxwQt8rPHBCly88cELPLzxwQtcvPHBDFy88cEOHLzxwQ9MvPHBD2y88cEIfMzxwQ_M7PHBCBz88cEJ3QzxwQkdHPHBD10c8cGjJBT2pGb3gwYzdLcDNfYURLQlZ3S2pZdkM4b09rZnBFRm9vSkNONmdXTDBMYzFMdTVZZyIyQU9qRm94MzNnOEpxN2pxQUszcUxhYS1hYzZMY0tUb1hhLXZSUWFBTFI0X25HeHNXVkEqcENBTVNUdzBtdU4yM0FxUVpseC1vS3JVRXZSWDlBNE9GbWhDeEFPVU0tUTd1QUJTckhkb1JGUzJac2JjZmhhUUZrWndGdUlBQ0JJcXJCcE11b2FnRWs0MEZuWHYyaUFiSVdyOUZ1QXVtOEFhUTN3WT0%3D',
                  coldHashData:
                    'CI2hnsQGEhQxMTcxMTkxMDczMjc1ODA2NTE0OBiImp7EBjIyQU9qRm94MGM3S3AzX2FES0JWd0tqWXZDOG9Pa2ZwRUZvb0pDTjZnV0wwTGMxTHU1WWc6MkFPakZveDMzZzhKcTdqcUFLM3FMYWEtYWM2TGNLVG9YYS12UlFhQUxSNF9uR3hzV1ZBQnBDQU1TVHcwbXVOMjNBcVFabHgtb0tyVUV2Ulg5QTRPRm1oQ3hBT1VNLVE3dUFCU3JIZG9SRlMyWnNiY2ZoYVFGa1p3RnVJQUNCSXFyQnBNdW9hZ0VrNDBGblh2MmlBYklXcjlGdUF1bThBYVEzd1k9',
                  hotHashData:
                    'CI2hnsQGEhM1MTg1NzQ0NjI4NDU0NDcwNDE1GIiansQGKJTk_BIopdD9Eiiekf4SKMjK_hIot-r-EijAg_8SKJGM_xIox4CAEyiLgoATKKSIgBMow4qAEyjDi4ATKNiLgBMoppCAEyjLkYATKImXgBMouJeAEyjGl4ATKJSZgBMo85qAEyjTnYATKPGdgBMo-J2AEyiOn4ATKNGggBMyMkFPakZveDBjN0twM19hREtCVndLall2QzhvT2tmcEVGb29KQ042Z1dMMExjMUx1NVlnOjJBT2pGb3gzM2c4SnE3anFBSzNxTGFhLWFjNkxjS1RvWGEtdlJRYUFMUjRfbkd4c1dWQUI0Q0FNU0lRMEtvdGY2RmE3QkJwTk44Z3E1QkJVWDNjX0NETWFuN1F2WXpRbWx3QVhXVnc9PQ%3D%3D',
                },
                screenDensityFloat: 1.6500000953674316,
                userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
                timeZone: 'Europe/Warsaw',
                browserName: 'Chrome',
                browserVersion: '138.0.0.0',
                acceptHeader:
                  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                deviceExperimentId:
                  'ChxOelV6TWpFek9UazJNREV3TWpBME1UUTRNQT09EOOSnsQGGOOSnsQG',
                rolloutToken: 'CPHVhdu0ye-FFRDGjvem2teNAxiQ5eixxt2OAw%3D%3D',
                screenWidthPoints: 896,
                screenHeightPoints: 750,
                utcOffsetMinutes: 120,
                connectionType: 'CONN_CELLULAR_4G',
                memoryTotalKbytes: '8000000',
                mainAppWebInfo: {
                  graftUrl:
                    'https://www.youtube.com/watch?v=KiFwzaXCypw&ab_channel=Theo-t3%E2%80%A4gg',
                  pwaInstallabilityStatus:
                    'PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED',
                  webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
                  isWebNativeShareAvailable: true,
                },
              },
              user: {
                lockedSafetyMode: false,
              },
              request: {
                useSsl: true,
                internalExperimentFlags: [],
                consistencyTokenJars: [],
              },
              clickTracking: {
                clickTrackingParams: 'CBcQ040EGAciEwjxqZeB4t-OAxXnYHoFHbkbClU=',
              },
              adSignalsInfo: {
                params: [
                  {
                    key: 'dt',
                    value: '1753712995646',
                  },
                  {
                    key: 'flash',
                    value: '0',
                  },
                  {
                    key: 'frm',
                    value: '0',
                  },
                  {
                    key: 'u_tz',
                    value: '120',
                  },
                  {
                    key: 'u_his',
                    value: '5',
                  },
                  {
                    key: 'u_h',
                    value: '960',
                  },
                  {
                    key: 'u_w',
                    value: '1707',
                  },
                  {
                    key: 'u_ah',
                    value: '912',
                  },
                  {
                    key: 'u_aw',
                    value: '1707',
                  },
                  {
                    key: 'u_cd',
                    value: '24',
                  },
                  {
                    key: 'bc',
                    value: '31',
                  },
                  {
                    key: 'bih',
                    value: '750',
                  },
                  {
                    key: 'biw',
                    value: '882',
                  },
                  {
                    key: 'brdim',
                    value: '3438,478,3438,478,1707,480,1711,916,896,750',
                  },
                  {
                    key: 'vis',
                    value: '1',
                  },
                  {
                    key: 'wgl',
                    value: 'true',
                  },
                  {
                    key: 'ca_type',
                    value: 'image',
                  },
                ],
                bid: 'ANyPxKp2WChTCuCF7uB9lPKXkjpvFYpCB1BKq3xvgP80tNV3iADjpFmWuAvCI_anomQXxuIwd6GycEDGICcthwaEtW7CGKfmVA',
              },
            },
            params:
              'CgtLaUZ3emFYQ3lwdxISQ2dOaGMzSVNBbVZ1R2dBJTNEGAEqM2VuZ2FnZW1lbnQtcGFuZWwtc2VhcmNoYWJsZS10cmFuc2NyaXB0LXNlYXJjaC1wYW5lbDABOAFAAQ%3D%3D',
            externalVideoId: 'KiFwzaXCypw',
          }),
        },
      })
      const data = await response.json()

      return data
    })

    console.log('Data from transcript:', dataFromTranscript)
  }

  async handleCookieConsent(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'cookie consent'
      )
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

  async expandDescriptionUntilTranscriptVisible(): Promise<boolean> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'expand description'
      )
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
        }

        const isTranscriptVisible = await this.isElementVisible(
          SELECTORS.SHOW_TRANSCRIPT
        )

        if (isTranscriptVisible) {
          console.log('Transcript button is now visible')
          return true
        }

        retryCount++

        if (retryCount < maxRetries) {
          console.log(
            `Transcript button not visible, retrying expand (${
              retryCount + 1
            }/${maxRetries})`
          )
          await this.wait(200)
        }
      } catch (error) {
        retryCount++

        console.log(
          `Expand button not found or not clickable (attempt ${retryCount + 1})`
        )
      }
    }

    console.log('Max retries reached for expand button')
    return false
  }

  async expandDescription(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'expand description'
      )
    }

    try {
      const expandButton = await this.page.waitForSelector(
        SELECTORS.EXPAND_BUTTON,
        { timeout: this.config.timeouts.selector }
      )

      if (expandButton) {
        await expandButton.click()
        console.log('Description expanded')

        await this.wait(300)
      }
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error, 'expand description')
    }
  }

  async getTitle(): Promise<string | null> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'title retrieval'
      )
    }

    try {
      const title = await this.page.waitForSelector(SELECTORS.TITLE, {
        timeout: this.config.timeouts.selector,
      })

      if (!title) {
        throw new Error('Title not found')
      }

      return title.evaluate((el) => el.textContent)
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error, 'title retrieval')
    }
  }

  async getDescription(): Promise<string | null> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'description retrieval'
      )
    }

    try {
      const description = await this.page.waitForSelector(
        SELECTORS.DESCRIPTION,
        {
          timeout: this.config.timeouts.selector,
        }
      )

      if (!description) {
        throw new Error('Description not found')
      }

      return description.evaluate((el) => el.textContent)
    } catch (error) {
      ErrorHandler.handlePuppeteerError(error, 'description retrieval')
    }
  }

  async showTranscript(): Promise<void> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'show transcript'
      )
    }

    try {
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
      ErrorHandler.handlePuppeteerError(error, 'show transcript button')
    }
  }

  async waitForTranscriptResponse(): Promise<unknown> {
    const maxWaitTime = this.config.timeouts.transcript
    const startTime = Date.now()

    while (
      !this.responseData.transcriptReceived &&
      Date.now() - startTime < maxWaitTime
    ) {
      await this.wait(100)
    }

    if (this.responseData.transcriptReceived) {
      return this.responseData.transcriptData
    }

    return null
  }

  async takeScreenshot(path: string): Promise<string> {
    if (!this.page) {
      ErrorHandler.handlePuppeteerError(
        'Browser not initialized',
        'screenshot capture'
      )
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
      ErrorHandler.handlePuppeteerError(error, 'screenshot capture')
    }
  }
}
