import { jest } from '@jest/globals'
import { TranscriptResult } from '../../src/types/transcript.types'

// Mock data factory
const createMockTranscriptData = (): TranscriptResult => ({
  transcript: 'Hello world This is a test',
  title: 'Test Video',
  description: 'Test Description',
})

export const createYoutubePuppeteerMock = () => {
  const mockData = createMockTranscriptData()

  return {
    YoutubePuppeteer: jest.fn().mockImplementation(() => ({
      initializeBrowser: jest.fn().mockImplementation(() => {}),
      navigateToVideo: jest.fn().mockImplementation(() => {}),
      setupResponseInterception: jest.fn().mockImplementation(() => {}),
      showTranscript: jest.fn().mockImplementation(() => {}),
      waitForTranscriptResponse: jest
        .fn()
        .mockImplementation(() => mockData.transcript),
      closeBrowser: jest.fn().mockImplementation(async () => {}),
      handleCookieConsent: jest.fn().mockImplementation(async () => {}),
      expandDescriptionUntilTranscriptVisible: jest
        .fn()
        .mockImplementation(async () => true),
      getTitle: jest.fn().mockImplementation(async () => mockData.title),
      getDescription: jest
        .fn()
        .mockImplementation(async () => mockData.description),
      takeScreenshot: jest
        .fn()
        .mockImplementation(async () => 'screenshot.png'),
    })),
  }
}
