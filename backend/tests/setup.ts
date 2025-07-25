import { afterAll, beforeAll, beforeEach, jest } from '@jest/globals'

import request from 'supertest'

import { app } from '../src/server'
import { createYoutubePuppeteerMock } from './mock/createYoutubePuppeteerMock'
import { restoreConsole, setupConsoleControl } from './utils/logs'
import { validateTestEnvironment } from './utils/validateTestEnvironment'

const setupMocks = (): void => {
  if (runIntegrationTests) {
    console.log('🚀 Using real YoutubePuppeteer for integration tests')
    return
  }

  console.log('🔧 Mocking YoutubePuppeteer for unit tests')

  jest.mock(
    '../src/puppetieer/youtube/YoutubePuppeteer',
    createYoutubePuppeteerMock
  )
}

const runIntegrationTests = process.env.INTEGRATION_TESTS === 'true'

setupMocks()

beforeAll(async () => {
  try {
    validateTestEnvironment()

    console.log(
      runIntegrationTests
        ? '🚀 Starting integration test suite with real Puppeteer...'
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
  // Reset mocks before each test (only if mocks are active)
  if (!runIntegrationTests) {
    jest.clearAllMocks()
  }
})

export { app, request }
