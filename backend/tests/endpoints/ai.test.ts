import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Dictionary } from '../../src/constants/dictionaries'
import { AIProcessingService } from '../../src/services/ai-processing.service'
import { app, request } from '../setup'

describe('AI Endpoints', () => {
  const mockTranscript = 'This is a test transcript for AI processing.'

  // Updated mock response to match actual service structure
  const createMockAIResponse = (
    options: {
      mindMap?: boolean
      socialPost?: boolean
      customOutput?: boolean
    } = {}
  ) => ({
    summary: 'Test summary',
    topics: 'Test topics',
    mindMap: options.mindMap ? 'Test mind map' : undefined,
    socialPost: options.socialPost ? 'Test social post' : undefined,
    customOutput: options.customOutput ? 'Test custom output' : undefined,
  })

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock AIProcessingService processTranscript method with dynamic response
    jest
      .spyOn(AIProcessingService.prototype, 'processTranscript')
      .mockImplementation(async (request) => {
        const { purpose, customPrompt } = request

        if (purpose === Dictionary.Purpose.Learning) {
          return createMockAIResponse({ mindMap: true })
        }

        if (purpose === Dictionary.Purpose.SocialMedia) {
          return createMockAIResponse({ socialPost: true })
        }

        if (purpose === Dictionary.Purpose.Custom && customPrompt) {
          return createMockAIResponse({ customOutput: true })
        }

        // Default response for other cases
        return createMockAIResponse()
      })
  })

  describe('POST /api/ai/process-transcript', () => {
    describe('Valid Requests', () => {
      test('should process transcript with Learning purpose and mind map', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
        expect(response.body.data).toHaveProperty('mindMap')
        // Optional properties may be undefined and not present in response
        expect(['string', 'undefined']).toContain(
          typeof response.body.data.socialPost
        )
        expect(['string', 'undefined']).toContain(
          typeof response.body.data.customOutput
        )
      })

      test('should process transcript with SocialMedia purpose and social post', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.SocialMedia,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
        expect(response.body.data).toHaveProperty('socialPost')
      })

      test('should process transcript with Custom purpose and custom prompt', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Analyze this transcript and provide insights',
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
        expect(response.body.data).toHaveProperty('customOutput')
      })

      test('should process transcript with all options enabled', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
          customPrompt: 'Comprehensive analysis',
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
        expect(response.body.data).toHaveProperty('mindMap')
      })

      test('should process very long transcript', async () => {
        const longTranscript = 'A'.repeat(10000)
        const requestBody = {
          transcript: longTranscript,
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Analyze this long transcript',
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
      })

      test('should process transcript with special characters', async () => {
        const specialTranscript =
          'Transkrypcja z polskimi znakami: ąćęłńóśźż i emoji 🚀'
        const requestBody = {
          transcript: specialTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
      })
    })

    describe('Invalid Requests - Validation Errors', () => {
      test('should reject request without transcript', async () => {
        const requestBody = {
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Błąd walidacji')
        expect(response.body.details).toBeDefined()
      })

      test('should reject request with empty transcript', async () => {
        const requestBody = {
          transcript: '',
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Błąd walidacji')
        expect(response.body.details).toBeDefined()
      })

      test('should reject request with whitespace-only transcript', async () => {
        const requestBody = {
          transcript: '   ',
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Błąd walidacji')
        expect(response.body.details).toBeDefined()
      })

      test('should reject request without purpose', async () => {
        const requestBody = {
          transcript: mockTranscript,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request with invalid purpose', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: 'invalid_purpose',
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should accept request without legacy options field (ignored if present)', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
      })

      test('should ignore unknown legacy options object and still process', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
          options: {},
        } as any

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
      })

      test('should ignore unknown legacy options structure and still process', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
          options: {
            generateMindMap: 'true',
            generateSocialPost: 123,
          },
        } as any

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
      })

      test('should reject request with multiple validation errors', async () => {
        const requestBody = {
          transcript: '',
          purpose: 'invalid_purpose',
          options: {},
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })
    })

    describe('Invalid Requests - HTTP Errors', () => {
      test('should reject request with invalid Content-Type', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .set('Content-Type', 'text/plain')
          .send(JSON.stringify(requestBody))
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request with malformed JSON', async () => {
        const response = await request(app)
          .post('/api/ai/process-transcript')
          .set('Content-Type', 'application/json')
          .send('{"invalid": json}')
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request with empty body', async () => {
        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send()
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request with null body', async () => {
        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(null as any)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })
    })

    describe('Edge Cases', () => {
      test('should handle request with very long custom prompt', async () => {
        const longPrompt = 'A'.repeat(10000)
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Custom,
          customPrompt: longPrompt,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('customOutput')
      })

      test('should handle request with special characters in custom prompt', async () => {
        const specialPrompt =
          'Analyze with special chars: ąćęłńóśźż 🚀 @#$%^&*()'
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Custom,
          customPrompt: specialPrompt,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('customOutput')
      })

      test('should handle request with Learning purpose regardless of legacy options', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('mindMap')
      })

      test('should handle request with SocialMedia purpose regardless of legacy options', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.SocialMedia,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('socialPost')
      })

      test('should handle request with Custom purpose but empty custom prompt', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Custom,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.customOutput).toBeUndefined()
      })
    })

    describe('Response Format', () => {
      test('should return correct response structure for successful request', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        // Check response structure
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveProperty('summary')
        expect(response.body.data).toHaveProperty('topics')
        expect(response.body.data).toHaveProperty('mindMap')
        // Optional properties may be undefined and not present in response
        expect(['string', 'undefined']).toContain(
          typeof response.body.data.socialPost
        )
        expect(['string', 'undefined']).toContain(
          typeof response.body.data.customOutput
        )

        // Check data types
        expect(typeof response.body.success).toBe('boolean')
        expect(typeof response.body.data.summary).toBe('string')
        expect(typeof response.body.data.topics).toBe('string')
        expect(['string', 'object', 'undefined']).toContain(
          typeof response.body.data.mindMap
        )
      })

      test('should return correct error response structure', async () => {
        const requestBody = {
          transcript: '',
          purpose: Dictionary.Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body).toHaveProperty('success', false)
        expect(response.body).toHaveProperty('error')
        expect(typeof response.body.error).toBe('string')
        expect(response.body.error.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Other HTTP Methods', () => {
    test('should reject GET request to process-transcript endpoint', async () => {
      const response = await request(app)
        .get('/api/ai/process-transcript')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should reject PUT request to process-transcript endpoint', async () => {
      const response = await request(app)
        .put('/api/ai/process-transcript')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should reject DELETE request to process-transcript endpoint', async () => {
      const response = await request(app)
        .delete('/api/ai/process-transcript')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should reject PATCH request to process-transcript endpoint', async () => {
      const response = await request(app)
        .patch('/api/ai/process-transcript')
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })

  describe('Non-existent Endpoints', () => {
    test('should return 404 for non-existent AI endpoint', async () => {
      const response = await request(app)
        .post('/api/ai/non-existent')
        .expect(404)

      expect(response.body.success).toBe(false)
    })

    test('should return 404 for non-existent AI subdirectory', async () => {
      const response = await request(app)
        .post('/api/ai/subdirectory/endpoint')
        .expect(404)

      expect(response.body.success).toBe(false)
    })
  })
})
