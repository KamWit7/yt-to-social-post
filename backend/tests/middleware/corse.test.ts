import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('CORS Preflight Requests', () => {
  test('should handle CORS preflight for transcript endpoint', async () => {
    const response = await request(app)
      .options('/api/transcript')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(204)

    // CORS headers should be present
    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:3000'
    )
    expect(response.headers['access-control-allow-methods']).toContain('GET')
    expect(response.headers['access-control-allow-headers']).toBe(
      'Content-Type'
    )
  })

  test('should handle CORS preflight for non-existent endpoints', async () => {
    const response = await request(app)
      .options('/api/nonexistent')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'GET')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(204)

    expect(response.headers['access-control-allow-origin']).toContain(
      'http://localhost:3000'
    )
    expect(response.headers['access-control-allow-methods']).toContain('GET')
    expect(response.headers['access-control-allow-headers']).toBe(
      'Content-Type'
    )
  })

  test('should support credentials', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000')
      .expect(200)

    expect(response.headers['access-control-allow-credentials']).toBe('true')
  })

  test('should not support credentials', async () => {
    const response = await request(app)
      .get('/api/health')
      // not allowed origin
      .set('Origin', 'http://localhost:6000')
      .expect(200)

    expect(response.headers['access-control-allow-credentials']).toBeUndefined()
  })

  test('should handle preflight for different HTTP methods', async () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

    for (const method of methods) {
      const response = await request(app)
        .options('/api/transcript')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', method)

      //
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    }
  })
})
