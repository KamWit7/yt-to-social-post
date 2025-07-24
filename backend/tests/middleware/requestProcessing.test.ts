import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Request Processing Middleware', () => {
  test('should handle concurrent requests', async () => {
    const requests = Array(5)
      .fill(0)
      .map(() => request(app).get('/api/health'))

    const responses = await Promise.all(requests)

    // All requests should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  test('should handle requests with query parameters', async () => {
    const response = await request(app)
      .get('/api/health')
      .query({ test: 'value', another: 'param' })
      .expect(200)

    expect(response.body.success).toBe(true)
  })

  test('should handle requests with special characters in query', async () => {
    const response = await request(app)
      .get('/api/health')
      .query({ test: 'value with spaces', special: '!@#$%^&*()' })
      .expect(200)

    expect(response.body.success).toBe(true)
  })
})
