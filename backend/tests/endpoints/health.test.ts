import { describe, expect, test } from '@jest/globals'
import { Response } from 'superagent'
import { HealthResponse } from '../../src/services/health.service'
import { ApiResponse } from '../../src/types/api.types'
import { app, request } from '../setup'

type HealthResponseApiType = Omit<Response, 'body'> & {
  body: ApiResponse<HealthResponse>
}

describe('GET /health', () => {
  test('should return 200 and health status', async () => {
    const response: HealthResponseApiType = await request(app)
      .get('/api/health')
      .expect(200)

    expect(response.body.data).toMatchObject({
      success: true,
      timestamp: expect.any(String) as unknown as string,
      message: 'get health check',
    })
  })

  test('should return valid timestamp format', async () => {
    const response: HealthResponseApiType = await request(app).get(
      '/api/health'
    )

    const timestamp = new Date(response.body.data?.timestamp ?? '')

    expect(timestamp).toBeInstanceOf(Date)
    expect(timestamp.getTime()).not.toBeNaN()
  })

  test('should have correct content type', async () => {
    const response = await request(app).get('/api/health')

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should return timestamp within reasonable time range', async () => {
    const beforeRequest = new Date()
    const response: HealthResponseApiType = await request(app).get(
      '/api/health'
    )

    const afterRequest = new Date()

    const responseTimestamp = new Date(response.body.data?.timestamp ?? '')

    expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(
      beforeRequest.getTime() - 1000
    )
    expect(responseTimestamp.getTime()).toBeLessThanOrEqual(
      afterRequest.getTime() + 1000
    )
  })
})
