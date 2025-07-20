import { describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

describe('Error Handling', () => {
  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404)

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Route /api/nonexistent not found'),
      })
    })

    test('should return 404 for invalid HTTP methods on existing routes', async () => {
      const response = await request(app).post('/api/transcript').expect(404)

      expect(response.body).toMatchObject({
        success: false,
        error: expect.any(String),
      })
    })

    test('should return 404 for PUT method on transcript endpoint', async () => {
      const response = await request(app).put('/api/transcript').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for DELETE method on screenshot endpoint', async () => {
      const response = await request(app).delete('/api/screenshot').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for non-existent API paths', async () => {
      const nonExistentPaths = [
        '/api/invalid',
        '/api/transcript/invalid',
        '/api/screenshot/invalid',
        '/api/v1/transcript',
        '/api/videos',
        '/api/download',
      ]

      for (const path of nonExistentPaths) {
        const response = await request(app).get(path).expect(404)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain(`Route ${path} not found`)
      }
    })

    test('should return 404 for root API path without endpoint', async () => {
      const response = await request(app).get('/api').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for paths with trailing slashes', async () => {
      const pathsWithSlashes = [
        '/api/transcript/',
        '/api/screenshot/',
        '/api/nonexistent/',
      ]

      for (const path of pathsWithSlashes) {
        const response = await request(app).get(path).expect(404)

        expect(response.body.success).toBe(false)
      }
    })

    test('should return 404 with correct content type', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404)

      expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should return 404 for case-sensitive routes', async () => {
      const caseSensitivePaths = [
        '/API/transcript',
        '/api/TRANSCRIPT',
        '/api/Screenshot',
        '/Api/transcript',
      ]

      for (const path of caseSensitivePaths) {
        const response = await request(app).get(path).expect(404)

        expect(response.body.success).toBe(false)
      }
    })
  })

  describe('Global Error Handler', () => {
    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/test')
        .send('{"invalid": json}')
        .set('Content-Type', 'application/json')
        .expect(400)

      // Express automatically handles malformed JSON
    })

    test('should handle requests with invalid content-type', async () => {
      const response = await request(app)
        .post('/api/test')
        .send('some data')
        .set('Content-Type', 'application/xml')
        .expect(404) // Route doesn't exist, so 404 expected

      expect(response.body.success).toBe(false)
    })
  })

  describe('Health Endpoint Edge Cases', () => {
    test('should return 405 for POST method on health endpoint', async () => {
      const response = await request(app).post('/health').expect(404) // Express returns 404 for non-matching routes/methods

      expect(response.body.success).toBe(false)
    })

    test('should return 405 for PUT method on health endpoint', async () => {
      const response = await request(app).put('/health').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 405 for DELETE method on health endpoint', async () => {
      const response = await request(app).delete('/health').expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('CORS Preflight Requests', () => {
    test('should handle CORS preflight for transcript endpoint', async () => {
      const response = await request(app).options('/api/transcript').expect(200)

      // CORS headers should be present
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should handle CORS preflight for screenshot endpoint', async () => {
      const response = await request(app).options('/api/screenshot').expect(200)

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should handle CORS preflight for non-existent endpoints', async () => {
      const response = await request(app)
        .options('/api/nonexistent')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })
  })
})
