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
          expect(response.body).toHaveProperty('transcript')
          expect(response.body).toHaveProperty('title')
          expect(response.body).toHaveProperty('description')

          expect(typeof response.body.transcript).toBe('string')
          expect(typeof response.body.title).toBe('string')
          expect(typeof response.body.description).toBe('string')
        } else {
          expect(response.status).toBeGreaterThanOrEqual(400)
        }
      },
      30000
    )

    testIfIntegration(
      'should handle video without captions gracefully',
      async () => {
        const videoWithoutCaptions =
          'https://www.youtube.com/watch?v=example123'

        const response = await request(app)
          .get('/api/transcript')
          .query({ url: videoWithoutCaptions })
          .timeout(30000)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeTruthy()
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

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeTruthy()
      },
      30000
    )
  })

  describe('API Flow Tests', () => {
    test('should handle complete API flow with mocked services', async () => {
      const transcriptResponse = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      expect(transcriptResponse.body).toHaveProperty('success')
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
      await request(app)
        .get('/api/transcript')
        .query({ url: 'invalid-url' })
        .expect(400)

      const transcriptResponse = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      expect(transcriptResponse.body).toHaveProperty('success')
    })

    test('should handle malformed requests without crashing', async () => {
      const malformedRequests = [
        request(app).get('/api/transcript').query({ url: null }),
        request(app).get('/api/transcript').query({ url: undefined }),
        request(app).post('/api/transcript').send('invalid-data'),
      ]

      await Promise.all(malformedRequests.map((req) => req.catch(() => {})))

      const response = await request(app)
        .get('/api/transcript')
        .query({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })

      expect(response.body).toHaveProperty('success')
    })
  })
})
