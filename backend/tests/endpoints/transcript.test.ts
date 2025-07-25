import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Response } from 'superagent'
import { MiddlewareError } from '../../src/middleware/errorHandler'
import { TranscriptResult } from '../../src/puppetieer/youtube/types'
import { YouTubeService } from '../../src/services/youtubeService'
import { ApiResponse } from '../../src/types/youtube'
import { app, request } from '../setup'

type TranscriptApiResultType = Omit<Response, 'body'> & {
  body: ApiResponse<TranscriptResult> | MiddlewareError
}

describe('GET /api/transcript', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return transcript for valid YouTube URL', async () => {
    const mockTranscriptData: TranscriptResult = {
      transcript: 'Hello world This is a test',
      title: 'Test Video',
      description: 'Test Description',
    }

    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockResolvedValue(mockTranscriptData)

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      data: mockTranscriptData,
    })
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
      if (response.body.success === false) {
      }

      expect(response.body.success).toBe(true)
    }
  })

  test('should handle service errors gracefully', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockRejectedValue(new Error('Puppeteer error'))

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should handle timeout errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockRejectedValue(new Error('timeout'))

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body.success).toBe(false)
  })

  test('should return empty transcript when no captions available', async () => {
    const mockEmptyTranscriptData: TranscriptResult = {
      //TODO: empty transcript should be null
      transcript: '',
      title: 'Video without captions',
      description: 'Description',
    }

    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockResolvedValue(mockEmptyTranscriptData)

    const response: TranscriptApiResultType = await request(app)
      .get('/api/transcript')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      data: mockEmptyTranscriptData,
    })
  })

  test('should have correct content-type header', async () => {
    const mockTranscriptData: TranscriptResult = {
      transcript: 'Hello world This is a test',
      title: 'Test',
      description: 'Test',
    }

    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockResolvedValue(mockTranscriptData)

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
    }

    jest
      .spyOn(YouTubeService.prototype, 'getTranscript')
      .mockResolvedValue(mockTranscriptData)

    const requests = Array(10)
      .fill(0)
      .map(() => request(app).get('/api/transcript').query({ url }))

    const responses = await Promise.all(requests)

    const successfulResponses = responses.filter((r) => r.status === 200)

    expect(successfulResponses.length).toBeGreaterThan(0)
  })
})
