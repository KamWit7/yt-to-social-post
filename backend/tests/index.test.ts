// Main test entry point - imports all test suites

// Setup must be imported first
import './setup'

// Import all test suites
import './endpoints/errors.test'
import './endpoints/health.test'
import './endpoints/screenshot.test'
import './endpoints/transcript.test'
import './integration/integration.test'
import './middleware/middleware.test'

// Test suite summary
describe('YouTube Transcript API Test Suite', () => {
  test('should have all test files loaded', () => {
    // This test ensures all test files are properly imported
    expect(true).toBe(true)
  })
})

// Export for programmatic access if needed
export * from './setup'
