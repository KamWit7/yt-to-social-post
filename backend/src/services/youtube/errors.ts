export const ERROR_MESSAGES = {
  TRANSCRIPT_NOT_FOUND: 'Transcript not found - no API request intercepted',
  TRANSCRIPT_FORMAT_NOT_RECOGNIZED: 'Transcript format not recognized',
  TRANSCRIPT_PROCESSING_ERROR: 'Error processing transcript data',
  TRANSCRIPT_NOT_AVAILABLE: 'Transcript not available',
  TITLE_NOT_FOUND: 'Title not found',
  DESCRIPTION_NOT_FOUND: 'Description not found',
} as const

export class YouTubeError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly url?: string
  ) {
    super(message)
    this.name = 'YouTubeError'
  }
}

export class ErrorHandler {
  static handlePuppeteerError(error: Error, context: string): never {
    throw new YouTubeError(
      `Puppeteer error in ${context}: ${error.message}`,
      'PUPPETEER_ERROR'
    )
  }

  static handleSelectorError(selector: string, action: string): never {
    throw new YouTubeError(
      `Could not ${action} element with selector: ${selector}`,
      'SELECTOR_ERROR'
    )
  }

  static handleTimeoutError(operation: string, timeout: number): never {
    throw new YouTubeError(
      `Timeout reached for ${operation} (${timeout}ms)`,
      'TIMEOUT_ERROR'
    )
  }

  static handleValidationError(message: string, url?: string): never {
    throw new YouTubeError(message, 'VALIDATION_ERROR', url)
  }
}
