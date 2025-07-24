import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Content-Type Headers Middleware', () => {
  test('should return JSON content-type for API endpoints', async () => {
    const response = await request(app).get('/api/health').expect(200)

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle accept headers correctly', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Accept', 'application/json')
      .expect(200)

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle wildcard accept headers', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Accept', '*/*')
      .expect(200)

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })
})
