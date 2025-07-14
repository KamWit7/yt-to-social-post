import type { LaunchOptions as PuppeteerLaunchOptions } from 'puppeteer'

export interface BrowserConfig {
  headless: boolean
  devtools: boolean
  viewport: { width: number; height: number }
  timeouts: {
    navigation: number
    selector: number
    transcript: number
  }
}

export interface TranscriptData {
  transcript: any
}

export interface TranscriptResult {
  transcript: string
}

export interface YouTubeErrorData {
  code: string
  url?: string
  context?: string
}

export interface ResponseInterceptionData {
  transcriptData: any
  transcriptReceived: boolean
}

// YouTube Transcript API Types
export interface TranscriptRun {
  text: string
}

export interface TranscriptSegmentRenderer {
  snippet: {
    runs: TranscriptRun[]
  }
}

export interface TranscriptSectionHeaderRenderer {
  sectionHeader: {
    sectionHeaderViewModel: {
      headline: {
        content: string
      }
    }
  }
}

export type TranscriptSegment = {
  transcriptSegmentRenderer?: TranscriptSegmentRenderer
  transcriptSectionHeaderRenderer?: TranscriptSectionHeaderRenderer
}

export interface YouTubeTranscriptResponse {
  actions: {
    updateEngagementPanelAction: {
      content: {
        transcriptRenderer: {
          content: {
            transcriptSearchPanelRenderer: {
              body: {
                transcriptSegmentListRenderer: {
                  initialSegments: TranscriptSegment[]
                }
              }
            }
          }
        }
      }
    }
  }[]
}

export { PuppeteerLaunchOptions }
