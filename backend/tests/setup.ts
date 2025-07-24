import { afterAll, beforeAll, beforeEach, jest } from '@jest/globals'
import request from 'supertest'

const mockTranscriptData: TranscriptResult = {
  transcript: 'Hello world This is a test',
  title: 'Test Video',
  description: 'Test Description',
}

// Mock Puppeteer for unit tests - must be done before importing app
jest.mock('../src/puppetieer/youtube/YoutubePuppeteer', () => ({
  YoutubePuppeteer: jest.fn().mockImplementation(() => ({
    initializeBrowser: jest.fn().mockImplementation(() => {}),
    navigateToVideo: jest.fn().mockImplementation(() => {}),
    setupResponseInterception: jest.fn().mockImplementation(() => {}),
    showTranscript: jest.fn().mockImplementation(() => {}),
    waitForTranscriptResponse: jest
      .fn()
      .mockImplementation(() => mockTranscriptData.transcript),
    closeBrowser: jest.fn().mockImplementation(async () => {}),
    handleCookieConsent: jest.fn().mockImplementation(async () => {}),
    expandDescriptionUntilTranscriptVisible: jest
      .fn()
      .mockImplementation(async () => true),
    getTitle: jest
      .fn()
      .mockImplementation(async () => mockTranscriptData.title),
    getDescription: jest
      .fn()
      .mockImplementation(async () => mockTranscriptData.description),
    takeScreenshot: jest.fn().mockImplementation(async () => 'screenshot.png'),
  })),
}))

// Import app after mocking
import { TranscriptResult } from '../src/puppetieer/youtube/types'
import { app } from '../src/server'

beforeAll(async () => {
  // Setup przed wszystkimi testami
  console.log('🧪 Starting test suite...')
})

afterAll(async () => {
  // Cleanup po wszystkich testach
  console.log('✅ Test suite completed')
})

beforeEach(() => {
  // Reset mocks przed każdym testem
  jest.clearAllMocks()
})

beforeAll(() => {
  const originalConsoleLog = console.log
  const originalConsoleError = console.error

  console.log = (...args: any[]) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleLog(...args)
    }
  }

  console.error = (...args: any[]) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleError(...args)
    }
  }
})

export { app, request }
