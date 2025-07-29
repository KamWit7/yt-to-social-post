import { afterAll, beforeAll, beforeEach, jest } from '@jest/globals'

import request from 'supertest'

import { app } from '../src/server'

import {
  mockDisplayErrorReasons,
  mockDisplayTranscriptInfo,
  mockExtractVideoIdFromUrl,
  mockFetchPage,
  mockFetchTranscript,
  mockHasTranscriptData,
  mockIsValidYouTubeUrl,
} from './mock/youtube-service.mock'
import { restoreConsole, setupConsoleControl } from './utils/logs'
import { validateTestEnvironment } from './utils/validateTestEnvironment'

const runIntegrationTests = process.env.INTEGRATION_TESTS === 'true'

beforeAll(async () => {
  try {
    validateTestEnvironment()

    console.log(
      runIntegrationTests
        ? '🚀 Starting integration test suite with real API calls...'
        : '🧪 Starting unit test suite with mocked services...'
    )

    setupConsoleControl()
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error)
    throw error
  }
})

afterAll(() => {
  restoreConsole()
})

beforeEach(() => {
  if (runIntegrationTests) {
    console.log('🚀 Skipping mocks for integration tests')
    return
  }

  jest.clearAllMocks()

  mockFetchPage('mock-video-id')
  mockFetchTranscript('mock-transcript')
  mockIsValidYouTubeUrl(true)
  mockExtractVideoIdFromUrl('mock-video-id')
  mockHasTranscriptData(true)
  mockDisplayErrorReasons()
  mockDisplayTranscriptInfo()
})

export { app, request }
