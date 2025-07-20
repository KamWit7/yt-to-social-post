import request from 'supertest'

// Mock Puppeteer for unit tests - must be done before importing app
jest.mock('../src/puppetieer/youtube/YoutubePuppeteer', () => {
  return {
    YoutubePuppeteer: jest.fn().mockImplementation(() => ({
      initializeBrowser: jest.fn(),
      navigateToVideo: jest.fn(),
      setupResponseInterception: jest.fn(),
      handleCookieConsent: jest.fn(),
      expandDescriptionUntilTranscriptVisible: jest
        .fn()
        .mockResolvedValue(true),
      getTitle: jest.fn().mockResolvedValue('Mock Title'),
      getDescription: jest.fn().mockResolvedValue('Mock Description'),
      showTranscript: jest.fn(),
      waitForTranscriptResponse: jest.fn().mockResolvedValue([]),
      takeScreenshot: jest.fn().mockResolvedValue('screenshot.png'),
      closeBrowser: jest.fn(),
    })),
  }
})

// Import app after mocking
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

// Suppress console.log during tests unless explicitly needed
beforeAll(() => {
  const originalConsoleLog = console.log
  console.log = (...args: any[]) => {
    if (process.env.VERBOSE_TESTS === 'true') {
      originalConsoleLog(...args)
    }
  }
})

export { app, request }
