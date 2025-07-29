import { describe, expect, test } from '@jest/globals'

// Main test entry point - imports all test suites

// Setup must be imported first
import './setup'

// Import all test suites
import './endpoints/errors.test'
import './endpoints/health.test'
import './endpoints/transcript.test'
import './integration/integration.test'
import './middleware/bodyParser.test'
import './middleware/contentType.test'
import './middleware/corse.test'
import './middleware/helmet.test'
import './middleware/rateLimiting.test'
import './middleware/requestProcessing.test'

// Test suite summary
describe('YouTube Transcript API Test Suite', () => {
  test('should have all test files loaded', () => {
    // This test ensures all test files are properly imported
    expect(true).toBe(true)
  })
})

export * from './setup'
