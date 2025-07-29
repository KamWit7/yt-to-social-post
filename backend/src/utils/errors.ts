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
    public readonly name: string,
    public readonly statusCode: number,
    public readonly url?: string
  ) {
    super(message)
    this.name = 'YouTubeError'
  }
}

export class ErrorHandler {
  static handleValidationError(
    error: string | Error | unknown,
    url?: unknown
  ): never {
    const errorMessage = error instanceof Error ? error.message : String(error)

    throw new YouTubeError(
      errorMessage,
      'VALIDATION_ERROR',
      400,
      url ? JSON.stringify(url) : undefined
    )
  }
}
