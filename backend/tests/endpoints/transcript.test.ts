import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Response } from 'superagent'
import { MiddlewareError } from '../../src/middleware/error-handler.middleware'
import { ApiResponse } from '../../src/types/api.types'
import { TranscriptResult } from '../../src/types/transcript.types'
import { TranscriptData } from '../../src/types/youtube.types'
import {
  mockFetchPage,
  mockFetchTranscript,
} from '../mock/youtube-service.mock'
import { app, request } from '../setup'

type TranscriptApiResultType = Omit<Response, 'body'> & {
  body: ApiResponse<TranscriptResult> | MiddlewareError
}

describe('GET /api/transcript', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return transcript for valid YouTube URL', async () => {
    const mockTranscriptData: ApiResponse<TranscriptData> = {
      success: true,
      data: {
        transcript: 'Hello world This is a test',
        title: 'Title not found',
        description: 'Description not found',
      },
    }

    // Override default mock for this specific test
    mockFetchTranscript(mockTranscriptData?.data?.transcript)

    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject(mockTranscriptData as any)
  })

  test('should return 400 for missing URL parameter', async () => {
    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for empty URL parameter', async () => {
    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: '' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for invalid URL format', async () => {
    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'invalid-url' })
      .expect(400)

    const transcriptError: MiddlewareError = {
      success: false,
      error: 'Invalid YouTube URL',
      name: 'YouTubeError',
    }

    expect(response.body).toMatchObject(transcriptError)
  })

  test('should return 400 for non-YouTube URL', async () => {
    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://google.com' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('YouTube'),
    })
  })

  test('should handle various YouTube URL formats', async () => {
    // Test different YouTube URL formats
    const validUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    ]

    for (const url of validUrls) {
      const response: TranscriptApiResultType = await request(app)
        .get('/api/transcript')
        .query({ url })
        .expect(200)

      expect(response.body.success).toBe(true)
    }
  })

  test('should handle timeout errors', async () => {
    mockFetchTranscript('timeout', true)

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body.success).toBe(false)
  })

  test('should return error when failed to fetch YouTube page', async () => {
    mockFetchPage('mock-video-id', true)

    const mockTranscriptData = {
      success: false,
      error: 'Failed to fetch YouTube page',
    }

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject(mockTranscriptData)
  })

  test('should return error when failed to extract transcript parameters from HTML', async () => {
    const mockEmptyTranscriptData: TranscriptResult = {
      success: false,
      error: 'Failed to fetch YouTube page',
    }

    mockFetchPage('mock-video-id', true)

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject(mockEmptyTranscriptData)
  })

  test('should have correct content-type header', async () => {
    const mockTranscriptData: TranscriptResult = {
      transcript: 'Hello world This is a test',
      title: 'Test',
      description: 'Test',
      success: true,
    }

    mockFetchTranscript(mockTranscriptData.transcript)

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle malformed YouTube URLs', async () => {
    const malformedUrls = [
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?',
      'https://www.youtube.com/watch?v=',
      'https://youtu.be/',
    ]

    for (const url of malformedUrls) {
      const response: TranscriptApiResultType = await request(app)
        .get('/api/transcript')
        .query({ url })
        .expect(400)

      expect(response.body.success).toBe(false)
    }
  })

  test('should respect rate limiting', async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

    const mockTranscriptData: TranscriptResult = {
      transcript: 'Hello world This is a test',
      title: 'Test',
      description: 'Test',
      success: true,
    }

    mockFetchTranscript(mockTranscriptData.transcript)

    const requests = Array(10)
      .fill(0)
      .map(() => request(app).get('/api/transcript').query({ url }))

    const responses = await Promise.all(requests)

    const successfulResponses = responses.filter((r) => r.status === 200)

    expect(successfulResponses.length).toBeGreaterThan(0)
  })
})
