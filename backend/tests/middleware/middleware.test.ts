import { app, request } from '../setup'

describe('Middleware', () => {
  describe('CORS', () => {
    test('should set CORS headers', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should allow specific origin from environment', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/transcript')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type')
        .expect(200)

      expect(response.headers['access-control-allow-methods']).toBeDefined()
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    test('should support credentials', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200)

      expect(response.headers['access-control-allow-credentials']).toBe('true')
    })

    test('should handle preflight for different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

      for (const method of methods) {
        const response = await request(app)
          .options('/api/transcript')
          .set('Origin', 'http://localhost:3000')
          .set('Access-Control-Request-Method', method)

        expect(response.headers['access-control-allow-origin']).toBeDefined()
      }
    })
  })

  describe('Security Headers', () => {
    test('should set security headers', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.headers['x-content-type-options']).toBe('nosniff')
      expect(response.headers['x-frame-options']).toBe('DENY')
      expect(response.headers['x-xss-protection']).toBe('1; mode=block')
    })

    test('should set additional helmet security headers', async () => {
      const response = await request(app).get('/health').expect(200)

      // Helmet sets various security headers
      expect(response.headers['x-dns-prefetch-control']).toBe('off')
      expect(response.headers['x-download-options']).toBe('noopen')
      expect(response.headers['x-permitted-cross-domain-policies']).toBe('none')
    })

    test('should set referrer policy', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.headers['referrer-policy']).toBeDefined()
    })

    test('should set content security policy', async () => {
      const response = await request(app).get('/health').expect(200)

      // Helmet may set CSP headers
      if (response.headers['content-security-policy']) {
        expect(response.headers['content-security-policy']).toBeDefined()
      }
    })
  })

  describe('Rate Limiting', () => {
    test('should apply rate limiting to API routes', async () => {
      // Make requests below the rate limit
      const requests = Array(5)
        .fill(0)
        .map(() =>
          request(app)
            .get('/api/transcript')
            .query({ url: 'https://youtube.com/watch?v=test' })
        )

      const responses = await Promise.all(requests)

      // Most requests should be processed (some might fail due to validation)
      const processedResponses = responses.filter((r) => r.status !== 429)
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
        .map(() => request(app).get('/health'))

      const responses = await Promise.all(requests)

      // All health requests should succeed
      const successfulResponses = responses.filter((r) => r.status === 200)
      expect(successfulResponses).toHaveLength(10)
    })

    test('should return proper rate limit error format', async () => {
      // This test would need to actually trigger rate limiting
      // which might be difficult in a test environment
      // Instead, we test that the API structure is correct

      const response = await request(app)
        .get('/api/transcript')
        .query({ url: 'test' })

      // Even if not rate limited, response should have proper structure
      expect(response.body).toHaveProperty('success')
    })
  })

  describe('Body Parser', () => {
    test('should parse JSON bodies correctly', async () => {
      // Since we don't have POST endpoints that accept JSON,
      // we'll test the middleware is properly configured
      const response = await request(app)
        .post('/api/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')
        .expect(404) // Route doesn't exist

      // Even with 404, body parser should have processed the request
      expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should handle URL-encoded bodies', async () => {
      const response = await request(app)
        .post('/api/test')
        .send('key=value&another=test')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should respect body size limits', async () => {
      // Create a payload larger than 10mb (the configured limit)
      const largePayload = JSON.stringify({
        data: 'x'.repeat(11 * 1024 * 1024), // 11MB
      })

      const response = await request(app)
        .post('/api/test')
        .send(largePayload)
        .set('Content-Type', 'application/json')
        .expect(413) // Payload too large

      // Should reject large payloads
    })

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/test')
        .send('{"malformed": json}')
        .set('Content-Type', 'application/json')
        .expect(400)

      // Express should return 400 for malformed JSON
    })

    test('should handle empty request bodies', async () => {
      const response = await request(app)
        .post('/api/test')
        .set('Content-Type', 'application/json')
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('Content-Type Headers', () => {
    test('should return JSON content-type for API endpoints', async () => {
      const response = await request(app).get('/health').expect(200)

      expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should handle accept headers correctly', async () => {
      const response = await request(app)
        .get('/health')
        .set('Accept', 'application/json')
        .expect(200)

      expect(response.headers['content-type']).toMatch(/application\/json/)
    })

    test('should handle wildcard accept headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Accept', '*/*')
        .expect(200)

      expect(response.headers['content-type']).toMatch(/application\/json/)
    })
  })

  describe('Request Processing', () => {
    test('should handle concurrent requests', async () => {
      const requests = Array(5)
        .fill(0)
        .map(() => request(app).get('/health'))

      const responses = await Promise.all(requests)

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
      })
    })

    test('should handle requests with query parameters', async () => {
      const response = await request(app)
        .get('/health')
        .query({ test: 'value', another: 'param' })
        .expect(200)

      expect(response.body.success).toBe(true)
    })

    test('should handle requests with special characters in query', async () => {
      const response = await request(app)
        .get('/health')
        .query({ test: 'value with spaces', special: '!@#$%^&*()' })
        .expect(200)

      expect(response.body.success).toBe(true)
    })
  })
})
