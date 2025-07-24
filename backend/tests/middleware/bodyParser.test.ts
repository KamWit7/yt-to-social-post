import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Body Parser Middleware', () => {
  test('should parse JSON bodies correctly', async () => {
    const response = await request(app)
      .post('/api/health')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json')
      .expect(200)

    expect(response.headers['content-type']).toMatch(/application\/json/)
  })

  test('should handle URL-encoded bodies', async () => {
    const response = await request(app)
      .post('/api/health')
      .send('key=value&another=test')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .expect(415)

    expect(response.body.success).toBe(false)
  })

  test('should respect body size limits', async () => {
    // Create a payload larger than 10mb (the configured limit)
    const largePayload = JSON.stringify({
      data: 'x'.repeat(11 * 1024 * 1024), // 11MB
    })

    const response = await request(app)
      .post('/api/health')
      .send(largePayload)
      .set('Content-Type', 'application/json')
      .expect(413) // Payload too large
  })

  test('should handle malformed JSON gracefully', async () => {
    const response = await request(app)
      .post('/api/health')
      .send('{"malformed": json}')
      .set('Content-Type', 'application/json')
      .expect(400)

    expect(response.body.success).toBe(false)
  })

  test('should handle empty request bodies', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .expect(200)

    expect(response.body.success).toBe(true)
  })
})
