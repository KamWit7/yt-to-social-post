import type { BrowserConfig } from './types'

export const DEFAULT_CONFIG: BrowserConfig = {
  headless: true,
  devtools: false,
  viewport: { width: 1080, height: 1024 },
  timeouts: {
    navigation: 10000,
    selector: 5000,
    transcript: 30000,
  },
}

export const BROWSER_OPTIONS = {
  headless: true,
  devtools: false,
} as const
