import { YOUTUBE_URL_PATTERNS } from './constants'

/**
 * Validates if a URL is a valid YouTube URL
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export function isValidYouTubeUrl(url: string): boolean {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return false

  return YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(trimmedUrl))
}

/**
 * Sanitizes text input by removing potentially dangerous content
 * @param text - The text to sanitize
 * @returns sanitized text
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return ''

  // Remove HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '')

  // Remove script tags and their content
  const withoutScripts = withoutHtml.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  )

  // Trim whitespace
  return withoutScripts.trim()
}

/**
 * Validates if a string is not empty and contains meaningful content
 * @param text - The text to validate
 * @returns boolean indicating if the text is valid
 */
export function isValidText(text: string): boolean {
  return typeof text === 'string' && text.trim().length > 0
}

/**
 * Extracts YouTube video ID from a YouTube URL
 * @param url - The YouTube URL
 * @returns video ID or null if not found
 */
export function extractYouTubeVideoId(url: string): string | null {
  const trimmedUrl = url.trim()

  // Match youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmedUrl.match(/youtube\.com\/watch\?v=([\w-]+)/)
  if (watchMatch) return watchMatch[1]

  // Match youtu.be/VIDEO_ID
  const shortMatch = trimmedUrl.match(/youtu\.be\/([\w-]+)/)
  if (shortMatch) return shortMatch[1]

  return null
}

/**
 * Validates form data before submission
 * @param formData - The form data to validate
 * @returns object with validation results
 */
export function validateFormData(formData: {
  url: string
  purpose: string
  customPurpose: string
}): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!isValidYouTubeUrl(formData.url)) {
    errors.push('Nieprawidłowy link YouTube')
  }

  if (!isValidText(formData.purpose)) {
    errors.push('Wybierz cel transkrypcji')
  }

  if (formData.purpose === 'Inny' && !isValidText(formData.customPurpose)) {
    errors.push('Wprowadź własny cel transkrypcji')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
