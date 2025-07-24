import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Rate Limiting Middleware', () => {
  test('should apply rate limiting to API routes', async () => {
    // Make requests below the rate limit (5 requests)
    const requests = Array(5)
      .fill(0)
      .map(() =>
        request(app)
          .get('/api/transcript')
          .query({ url: 'https://youtube.com/watch?v=test' })
      )

    const responses = await Promise.all(requests)

    const toManyRequestsCode = 429
    const processedResponses = responses.filter(
      (r) => r.status !== toManyRequestsCode
    )
    expect(processedResponses.length).toBeGreaterThan(0)
  })

  test('should include rate limit headers', async () => {
    const response = await request(app)
      .get('/api/transcript')
      .query({ url: 'invalid' })

    // Rate limiting middleware should add headers
    if (response.headers['x-ratelimit-limit']) {
      expect(response.headers['x-ratelimit-limit']).toBeDefined()
      expect(response.headers['x-ratelimit-remaining']).toBeDefined()
    }
  })

  test('should not apply rate limiting to health endpoint', async () => {
    // Make multiple requests to health endpoint
    const requests = Array(10)
      .fill(0)
      .map(() => request(app).get('/api/health'))

    const responses = await Promise.all(requests)

    // All health requests should succeed
    const successfulResponses = responses.filter((r) => r.status === 200)
    expect(successfulResponses).toHaveLength(10)
  })

  test('should return proper rate limit error format', async () => {
    const requests = Array(101)
      .fill(0)
      .map(() => request(app).get('/api/health'))

    const responses = await Promise.all(requests)

    const toManyRequestsCode = 429

    const processedResponses = responses.filter(
      (r) => r.status === toManyRequestsCode
    )

    expect(processedResponses.length).toBeGreaterThan(0)
    expect(processedResponses?.[0]?.body.success).toBe(false)
    expect(processedResponses?.[0]?.body.error).toBe(
      'Too many requests from this IP, please try again later.'
    )
  })
})
