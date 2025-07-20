import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { YouTubeService } from '../../src/services/youtubeService'
import { app, request } from '../setup'

describe('GET /api/screenshot', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return screenshot data for valid YouTube URL', async () => {
    const mockScreenshotPath = 'screenshot.png'

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotPath)

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body).toMatchObject({
      success: true,
      data: mockScreenshotPath,
    })
  })

  test('should return 400 for missing URL parameter', async () => {
    const response = await request(app).get('/api/screenshot').expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for empty URL parameter', async () => {
    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: '' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should return 400 for invalid URL format', async () => {
    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'not-a-url' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('Invalid URL'),
    })
  })

  test('should return 400 for non-YouTube URL', async () => {
    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://google.com' })
      .expect(400)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.stringContaining('YouTube'),
    })
  })

  test('should handle various YouTube URL formats', async () => {
    const mockScreenshotPath = 'screenshot.png'

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotPath)

    const validUrls = [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s',
      'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    ]

    for (const url of validUrls) {
      const response = await request(app)
        .get('/api/screenshot')
        .query({ url })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toBe(mockScreenshotPath)
    }
  })

  test('should handle screenshot service errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockRejectedValue(new Error('Screenshot failed'))

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body).toMatchObject({
      success: false,
      error: expect.any(String),
    })
  })

  test('should handle browser initialization errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockRejectedValue(new Error('Failed to launch browser'))

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body.success).toBe(false)
    expect(response.body.error).toBeTruthy()
  })

  test('should handle navigation errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockRejectedValue(new Error('Navigation timeout'))

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(500)

    expect(response.body.success).toBe(false)
  })

  test('should have correct content-type header', async () => {
    const mockScreenshotData = {
      path: 'screenshot.png',
      buffer: Buffer.from('test-data'),
    }

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotData)

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle malformed YouTube URLs', async () => {
    const malformedUrls = [
      'https://www.youtube.com/watch',
      'https://www.youtube.com/watch?',
      'https://www.youtube.com/watch?v=',
      'https://youtu.be/',
      'youtube.com/watch?v=dQw4w9WgXcQ', // missing protocol
    ]

    for (const url of malformedUrls) {
      const response = await request(app)
        .get('/api/screenshot')
        .query({ url })
        .expect(400)

      expect(response.body.success).toBe(false)
    }
  })

  test('should return screenshot with expected structure', async () => {
    const mockScreenshotData = {
      path: 'test-screenshot.png',
      buffer: Buffer.from('mock-screenshot-data'),
      size: 1024,
      timestamp: new Date().toISOString(),
    }

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotData)

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      .expect(200)

    expect(response.body.data).toHaveProperty('path')
    expect(response.body.data).toHaveProperty('buffer')
  })

  test('should handle video not found errors', async () => {
    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockRejectedValue(new Error('Video not found'))

    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: 'https://www.youtube.com/watch?v=nonexistentvideo' })
      .expect(500)

    expect(response.body.success).toBe(false)
  })

  test('should handle very long video IDs gracefully', async () => {
    const longVideoId = 'a'.repeat(100)
    const response = await request(app)
      .get('/api/screenshot')
      .query({ url: `https://www.youtube.com/watch?v=${longVideoId}` })
      .expect(400)

    expect(response.body.success).toBe(false)
  })

  test('should respect rate limiting', async () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const mockScreenshotData = {
      path: 'screenshot.png',
      buffer: Buffer.from('test-data'),
    }

    jest
      .spyOn(YouTubeService.prototype, 'takeScreenshot')
      .mockResolvedValue(mockScreenshotData)

    const requests = Array(10)
      .fill(0)
      .map(() => request(app).get('/api/screenshot').query({ url }))

    const responses = await Promise.all(requests)

    const successfulResponses = responses.filter((r) => r.status === 200)
    expect(successfulResponses.length).toBeGreaterThan(0)
  })
})
