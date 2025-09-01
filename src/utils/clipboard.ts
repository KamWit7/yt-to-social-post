import { COPY_TIMEOUT, ERROR_MESSAGES } from './constants'
import { sanitizeText } from './validation'

/**
 * Interface for clipboard operation result
 */
export interface ClipboardResult {
  success: boolean
  error?: string
}

/**
 * Copies text to clipboard using modern Clipboard API with fallback
 * @param text - The text to copy
 * @returns Promise that resolves to ClipboardResult
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    // Validate and sanitize input
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text to copy')
    }

    const sanitizedText = sanitizeText(text)
    if (!sanitizedText) {
      throw new Error('Text is empty after sanitization')
    }

    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(sanitizedText)
      return { success: true }
    }

    // Fallback for older browsers or non-secure contexts
    return await fallbackCopyToClipboard(sanitizedText)
  } catch (error) {
    console.error('Copy to clipboard failed:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : ERROR_MESSAGES.COPY_FAILED,
    }
  }
}

/**
 * Fallback copy method using document.execCommand
 * @param text - The text to copy
 * @returns Promise that resolves to ClipboardResult
 */
async function fallbackCopyToClipboard(text: string): Promise<ClipboardResult> {
  return new Promise((resolve) => {
    try {
      // Create temporary textarea element
      const textArea = document.createElement('textarea')
      textArea.value = text

      // Make it invisible
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      textArea.style.pointerEvents = 'none'

      // Add to DOM
      document.body.appendChild(textArea)

      // Focus and select
      textArea.focus()
      textArea.select()

      // Execute copy command
      const successful = document.execCommand('copy')

      // Clean up
      document.body.removeChild(textArea)

      if (successful) {
        resolve({ success: true })
      } else {
        resolve({
          success: false,
          error: 'execCommand copy failed',
        })
      }
    } catch (error) {
      resolve({
        success: false,
        error:
          error instanceof Error ? error.message : ERROR_MESSAGES.COPY_FAILED,
      })
    }
  })
}

/**
 * Hook-like function to manage copy state with timeout
 * @param onCopy - Function to call when copy is triggered
 * @param timeout - Timeout duration in milliseconds
 * @returns Object with copy function and state management
 */
export function createCopyHandler(
  onCopy: (text: string) => Promise<ClipboardResult>,
  timeout: number = COPY_TIMEOUT
) {
  let timeoutId: NodeJS.Timeout | null = null

  const copyWithTimeout = async (
    text: string,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    try {
      const result = await onCopy(text)

      if (result.success) {
        onSuccess?.()

        // Clear existing timeout
        if (timeoutId) {
          global.clearTimeout(timeoutId)
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
          onSuccess?.()
        }, timeout)
      } else {
        onError?.(result.error || ERROR_MESSAGES.COPY_FAILED)
      }
    } catch (error) {
      onError?.(
        error instanceof Error ? error.message : ERROR_MESSAGES.COPY_FAILED
      )
    }
  }

  const clearTimeoutHandler = () => {
    if (timeoutId) {
      global.clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    copyWithTimeout,
    clearTimeout: clearTimeoutHandler,
  }
}
