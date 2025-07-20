import { describe, expect, test } from '@jest/globals'
import { HealthResponse } from '../../src/services/healtService'
import { ApiResponse } from '../../src/types/youtube'
import { app, request } from '../setup'

describe('GET /health', () => {
  test('should return 200 and health status', async () => {
    const response = await request(app).get('/api/health').expect(200)

    const concurrentResponse: Required<ApiResponse<HealthResponse>> = {
      success: true,
      data: {
        success: true,
        timestamp: new Date().toISOString(),
        message: 'YouTube Transcript API is running',
      },
      error: 'error',
      details: 'details',
    }

    expect(response.body).toMatchObject(concurrentResponse.data)
  })

  test('should return valid timestamp format', async () => {
    const response = await request(app).get('/api/health')
    const timestamp = new Date(response.body.timestamp)
    expect(timestamp).toBeInstanceOf(Date)
    expect(timestamp.getTime()).not.toBeNaN()
  })

  test('should have correct content type', async () => {
    const response = await request(app).get('/api/health')

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should return timestamp within reasonable time range', async () => {
    const beforeRequest = new Date()
    const response = await request(app).get('/api/health')
    const afterRequest = new Date()

    const responseTimestamp = new Date(response.body.timestamp)

    expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(
      beforeRequest.getTime() - 1000
    )
    expect(responseTimestamp.getTime()).toBeLessThanOrEqual(
      afterRequest.getTime() + 1000
    )
  })
})
