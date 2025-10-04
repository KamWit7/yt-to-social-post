/**
 * Centralized API Error Handling System
 *
 * This module provides a clean, type-safe approach to handling API errors
 * with proper separation of concerns and maintainable error mapping.
 */

export interface ApiErrorResponse {
  error: string
  code: number
  type: string
}

export interface ErrorMapping {
  statusCode: number
  message: string
  type: string
  matchers: string[]
}

/**
 * Configuration-driven error mappings
 * Each error type is defined with its HTTP status, user message, type, and detection patterns
 */
const ERROR_MAPPINGS: ErrorMapping[] = [
  {
    statusCode: 503,
    message: 'Model jest obecnie przeciążony. Spróbuj ponownie za chwilę.',
    type: 'service_unavailable',
    matchers: ['"code":503', 'overloaded'],
  },
  {
    statusCode: 429,
    message: 'Przekroczono limit zapytań. Spróbuj ponownie później.',
    type: 'rate_limit',
    matchers: ['"code":429', 'quota'],
  },
  {
    statusCode: 400,
    message: 'Nieprawidłowe żądanie. Sprawdź dane wejściowe.',
    type: 'bad_request',
    matchers: ['"code":400', 'invalid'],
  },
]

/**
 * Default fallback error for unhandled cases
 */
const DEFAULT_ERROR: ErrorMapping = {
  statusCode: 500,
  message: 'Wystąpił nieoczekiwany błąd serwera. Spróbuj ponownie.',
  type: 'internal_error',
  matchers: [],
}

/**
 * Extracts error message from various error types safely
 */
function extractErrorMessage(error: unknown): string | null {
  if (!error || typeof error !== 'object') {
    return null
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return null
}

/**
 * Finds the appropriate error mapping based on error message content
 */
function findErrorMapping(errorMessage: string): ErrorMapping {
  return (
    ERROR_MAPPINGS.find((mapping) =>
      mapping.matchers.some((matcher) => errorMessage.includes(matcher))
    ) || DEFAULT_ERROR
  )
}

/**
 * Creates a standardized JSON error response
 */
function createErrorResponse(mapping: ErrorMapping): Response {
  const errorResponse: ApiErrorResponse = {
    error: mapping.message,
    code: mapping.statusCode,
    type: mapping.type,
  }

  return new Response(JSON.stringify(errorResponse), {
    status: mapping.statusCode,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Main error handler that processes any error and returns appropriate HTTP response
 *
 * @param error - The error to handle (can be any type)
 * @param context - Optional context for logging (e.g., 'Chat API', 'Upload API')
 * @returns Standardized error Response
 */
export function handleApiError(error: unknown, context = 'API'): Response {
  console.error(`${context} error:`, error)

  const errorMessage = extractErrorMessage(error)

  if (!errorMessage) {
    return createErrorResponse(DEFAULT_ERROR)
  }

  try {
    const mapping = findErrorMapping(errorMessage)
    return createErrorResponse(mapping)
  } catch (processingError) {
    console.error('Error processing failed:', processingError)
    return createErrorResponse(DEFAULT_ERROR)
  }
}

/**
 * Type guard to check if an error is a known API error type
 */
export function isApiError(error: unknown): error is Error {
  return error instanceof Error && extractErrorMessage(error) !== null
}

/**
 * Utility to create custom API errors with proper typing
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly type: string = 'internal_error'
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
