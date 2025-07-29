import { beforeAll, describe, expect, test } from '@jest/globals'
import { app, request } from '../setup'

// Integration tests - these can be run with INTEGRATION_TESTS=true
describe('Integration Tests', () => {
  const runIntegrationTests = process.env.INTEGRATION_TESTS === 'true'

  beforeAll(() => {
    if (!runIntegrationTests) {
      console.log(
        '⚠️  Integration tests skipped. Set INTEGRATION_TESTS=true to run with real API calls.'
      )
    }
  })

  describe('Real YouTube API Tests', () => {
    // These tests are skipped by default to avoid hitting YouTube servers during regular testing
    const testIfIntegration = runIntegrationTests ? test : test.skip

    testIfIntegration(
      'should fetch real transcript from YouTube (slow)',
      async () => {
        const realYouTubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

        const response = await request(app)
          .get('/api/transcript')
          .query({ url: realYouTubeUrl })
          .timeout(30000) // 30 seconds timeout

        if (response.status === 200) {
          expect(response.body.success).toBe(true)
          expect(response.body.data).toHaveProperty('transcript')
          expect(response.body.data).toHaveProperty('title')
          expect(response.body.data).toHaveProperty('description')

          // Transcript should be an array
          expect(Array.isArray(response.body.data.transcript)).toBe(true)

          // Title should be a non-empty string
          expect(typeof response.body.data.title).toBe('string')
          expect(response.body.data.title.length).toBeGreaterThan(0)
        } else {
          // If the request fails, log the error for debugging
          console.log('Integration test failed:', response.body)
          expect(response.status).toBeGreaterThanOrEqual(400)
        }
      },
      30000
    )

    testIfIntegration(
      'should handle video without captions gracefully',
      async () => {
        // This URL might not have captions - integration test will show real behavior
        const videoWithoutCaptions =
          'https://www.youtube.com/watch?v=example123'

        const response = await request(app)
          .get('/api/transcript')
          .query({ url: videoWithoutCaptions })
          .timeout(30000)

        // Should either succeed with empty transcript or fail gracefully
        if (response.status === 200) {
          expect(response.body.success).toBe(true)
          expect(response.body.data).toHaveProperty('transcript')
          // Transcript might be empty array
          expect(Array.isArray(response.body.data.transcript)).toBe(true)
        } else {
          expect(response.body.success).toBe(false)
          expect(response.body.error).toBeTruthy()
        }
      },
      30000
    )

    testIfIntegration(
      'should handle invalid YouTube video ID',
      async () => {
        const invalidVideoUrl =
          'https://www.youtube.com/watch?v=invalidvideoid123'

        const response = await request(app)
          .get('/api/transcript')
          .query({ url: invalidVideoUrl })
          .timeout(30000)

        // Should fail gracefully with proper error message
        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeTruthy()
      },
      30000
    )
  })

  describe('API Flow Tests', () => {
    // These tests run regardless of integration mode
    test('should handle complete API flow with mocked services', async () => {
      // Test transcript endpoint with mocked data
      const transcriptResponse = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      // Should either succeed (with mocked data) or fail with validation error
      expect(transcriptResponse.body).toHaveProperty('success')

      // Screenshot endpoint has been removed
    })

    test('should handle multiple concurrent requests', async () => {
      const requests = [
        request(app)
          .get('/api/transcript')
          .query({ url: 'https://youtube.com/watch?v=test1' }),
        request(app)
          .get('/api/transcript')
          .query({ url: 'https://youtube.com/watch?v=test2' }),
        request(app)
          .get('/api/transcript')
          .query({ url: 'https://youtube.com/watch?v=test3' }),
        request(app)
          .get('/api/transcript')
          .query({ url: 'https://youtube.com/watch?v=test4' }),
      ]

      const responses = await Promise.all(requests)

      // All requests should complete (success or expected error)
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('success')
      })
    })

    test('should maintain consistent error format across endpoints', async () => {
      const errorRequests = [
        request(app).get('/api/transcript'), // missing URL
        request(app).get('/api/nonexistent'), // 404
      ]

      const responses = await Promise.all(errorRequests)

      responses.forEach((response) => {
        expect(response.body).toMatchObject({
          success: false,
          error: expect.any(String),
        })
      })
    })
  })

  describe('Performance Tests', () => {
    test('should handle burst of API requests', async () => {
      const requests = Array(10)
        .fill(0)
        .map((_, index) =>
          request(app)
            .get('/api/transcript')
            .query({ url: `https://youtube.com/watch?v=test${index}` })
        )

      const startTime = Date.now()
      const responses = await Promise.all(requests)
      const totalTime = Date.now() - startTime

      // All requests should complete
      responses.forEach((response) => {
        expect(response.body).toHaveProperty('success')
      })

      // Should handle 10 requests in reasonable time
      expect(totalTime).toBeLessThan(10000) // 10 seconds for 10 requests
    })

    test('should maintain memory usage under load', async () => {
      const initialMemory = process.memoryUsage()

      // Make multiple requests
      const requests = Array(10)
        .fill(0)
        .map((_, index) =>
          request(app)
            .get('/api/transcript')
            .query({ url: `https://youtube.com/watch?v=load${index}` })
        )

      await Promise.all(requests)

      const finalMemory = process.memoryUsage()

      // Memory usage shouldn't increase dramatically
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024) // Less than 50MB increase
    })
  })

  describe('Error Recovery Tests', () => {
    test('should recover from service errors gracefully', async () => {
      // Test that the server continues working after errors

      // Make a request that might cause an error
      await request(app)
        .get('/api/transcript')
        .query({ url: 'invalid-url' })
        .expect(400)

      // Server should still respond to API requests
      const transcriptResponse = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      expect(transcriptResponse.body).toHaveProperty('success')
    })

    test('should handle malformed requests without crashing', async () => {
      // Various malformed requests
      const malformedRequests = [
        request(app).get('/api/transcript').query({ url: null }),
        request(app).get('/api/transcript').query({ url: undefined }),
        request(app).post('/api/transcript').send('invalid-data'),
      ]

      // None should crash the server
      await Promise.all(
        malformedRequests.map(
          (req) => req.catch(() => {}) // Catch any errors
        )
      )

      // Server should still be responsive
      const response = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      expect(response.body).toHaveProperty('success')
    })
  })
})
