/**
 * Centralized logging utility with consistent formatting
 */
export class Logger {
  static info(message: string): void {
    console.log(`ℹ️  ${message}`)
  }

  static success(message: string): void {
    console.log(`✅ ${message}`)
  }

  static warning(message: string): void {
    console.log(`⚠️  ${message}`)
  }

  static error(message: string, error?: Error): void {
    console.error(`❌ ${message}`)
    if (error) {
      console.error(`   Details: ${error.message}`)
    }
  }

  static progress(message: string): void {
    console.log(`🔄 ${message}`)
  }

  static debug(message: string, data?: any): void {
    console.log(`🔍 ${message}`)
    if (data) {
      console.log(`   Data:`, data)
    }
  }

  static result(message: string): void {
    console.log(`🎯 ${message}`)
  }
}

/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Handles fetch-related errors with appropriate logging
   */
  static handleFetchError(error: unknown, context: string): void {
    if (error instanceof Error) {
      Logger.error(`Error during ${context}: ${error.message}`)

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        Logger.error(
          'Possible network or CORS error. Check internet connection.'
        )
      }
    } else {
      Logger.error(`Unexpected error during ${context}:`, error as Error)
    }
  }

  /**
   * Handles parsing-related errors with appropriate logging
   */
  static handleParsingError(error: unknown, context: string): void {
    if (error instanceof Error) {
      if (error instanceof SyntaxError) {
        Logger.error(`Parsing error in ${context}: Invalid JSON data`)
        Logger.error(`Details: ${error.message}`)
      } else {
        Logger.error(`Error during ${context}: ${error.message}`)
      }
    }
  }
}
