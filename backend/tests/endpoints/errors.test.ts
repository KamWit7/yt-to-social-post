import { describe, expect, test } from '@jest/globals'
import { Response } from 'supertest'
import { app, request } from '../setup'
import { MiddlewareError } from '../../src/middleware/error-handler.middleware'

type MiddlewareErrorReturnType = Omit<Response, 'body'> & {
  body: MiddlewareError
}

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

    test('should return 404 for non-existent API paths', async () => {
      const nonExistentPaths = [
        '/api/invalid',
        '/api/transcript/invalid',
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

    test('should return 404 with correct content type', async () => {
      const response = await request(app).get('/api/nonexistent').expect(404)

      expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should return 404 for case-sensitive routes', async () => {
      const caseSensitivePaths = [
        '/API/transcript',
        '/api/TRANSCRIPT',
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

    test('should return 415 for requests with invalid content-type', async () => {
      const response = await request(app)
        .post('/api/health')
        .send('<xml>data</xml>')
        .set('Content-Type', 'application/xml')

      expect(response.status).toBe(415) // Oczekujemy statusu 415
      expect(response.body.success).toBe(false)
      expect(response.body.error.message).toContain(
        'Invalid Content-type - only application/json alowed'
      )
    })
  })

  describe('Health Endpoint Edge Cases', () => {
    test('should return 404 for POST method on health endpoint', async () => {
      const response = await request(app).post('/health').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for PUT method on health endpoint', async () => {
      const response = await request(app).put('/health').expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for DELETE method on health endpoint', async () => {
      const response = await request(app).delete('/health').expect(404)

      expect(response.body.success).toBe(false)
    })
  })
})
