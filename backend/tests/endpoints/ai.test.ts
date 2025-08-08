import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { AIProcessingService } from '../../src/services/ai-processing.service'
import { Purpose } from '../../src/validations/ai.validations'
import { app, request } from '../setup'

describe('AI Endpoints', () => {
  const mockTranscript = 'This is a test transcript for AI processing.'
  const mockAIResponse = {
    summary: 'Test summary',
    topics: 'Test topics',
    mindMap: undefined,
    socialPost: undefined,
    customOutput: undefined,
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock AIProcessingService processTranscript method
    jest
      .spyOn(AIProcessingService.prototype, 'processTranscript')
      .mockResolvedValue(mockAIResponse)
  })

  describe('POST /api/ai/process-transcript', () => {
    describe('Valid Requests', () => {
      test('should process transcript with Learning purpose and mind map', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
        expect(response.body).toHaveProperty('mindMap')
        expect(response.body).toHaveProperty('socialPost')
        expect(response.body).toHaveProperty('customOutput')
      })

      test('should process transcript with SocialMedia purpose and social post', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.SocialMedia,
          options: {
            generateSocialPost: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
        expect(response.body).toHaveProperty('socialPost')
      })

      test('should process transcript with Custom purpose and custom prompt', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Custom,
          options: {
            customPrompt: 'Analyze this transcript and provide insights',
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
        expect(response.body).toHaveProperty('customOutput')
      })

      test('should process transcript with all options enabled', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
            generateSocialPost: true,
            customPrompt: 'Comprehensive analysis',
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
        expect(response.body).toHaveProperty('mindMap')
      })

      test('should process very long transcript', async () => {
        const longTranscript = 'A'.repeat(10000)
        const requestBody = {
          transcript: longTranscript,
          purpose: Purpose.Custom,
          options: {
            customPrompt: 'Analyze this long transcript',
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
      })

      test('should process transcript with special characters', async () => {
        const specialTranscript =
          'Transkrypcja z polskimi znakami: ąćęłńóśźż i emoji 🚀'
        const requestBody = {
          transcript: specialTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
      })
    })

    describe('Invalid Requests - Validation Errors', () => {
      test('should reject request without transcript', async () => {
        const requestBody = {
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Transkrypcja nie może być pusta')
      })

      test('should reject request with empty transcript', async () => {
        const requestBody = {
          transcript: '',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Transkrypcja nie może być pusta')
      })

      test('should reject request with whitespace-only transcript', async () => {
        const requestBody = {
          transcript: '   ',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain('Transkrypcja nie może być pusta')
      })

      test('should reject request without purpose', async () => {
        const requestBody = {
          transcript: mockTranscript,
          options: {
            generateMindMap: true,
          },
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
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request without options', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
      })

      test('should reject request with empty options', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {},
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toContain(
          'Musisz wybrać przynajmniej jedną opcję'
        )
      })

      test('should reject request with invalid options structure', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: 'true', // should be boolean
            generateSocialPost: 123, // should be boolean
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBeDefined()
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
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
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
          purpose: Purpose.Custom,
          options: {
            customPrompt: longPrompt,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('customOutput')
      })

      test('should handle request with special characters in custom prompt', async () => {
        const specialPrompt =
          'Analyze with special chars: ąćęłńóśźż 🚀 @#$%^&*()'
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Custom,
          options: {
            customPrompt: specialPrompt,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body).toHaveProperty('customOutput')
      })

      test('should handle request with Learning purpose but no mind map option', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: false,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.mindMap).toBeUndefined()
      })

      test('should handle request with SocialMedia purpose but no social post option', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.SocialMedia,
          options: {
            generateSocialPost: false,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.socialPost).toBeUndefined()
      })

      test('should handle request with Custom purpose but empty custom prompt', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Custom,
          options: {
            customPrompt: '',
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        expect(response.body.success).toBe(true)
        expect(response.body.customOutput).toBeUndefined()
      })
    })

    describe('Response Format', () => {
      test('should return correct response structure for successful request', async () => {
        const requestBody = {
          transcript: mockTranscript,
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const response = await request(app)
          .post('/api/ai/process-transcript')
          .send(requestBody)
          .expect(200)

        // Check response structure
        expect(response.body).toHaveProperty('success', true)
        expect(response.body).toHaveProperty('summary')
        expect(response.body).toHaveProperty('topics')
        expect(response.body).toHaveProperty('mindMap')
        expect(response.body).toHaveProperty('socialPost')
        expect(response.body).toHaveProperty('customOutput')

        // Check data types
        expect(typeof response.body.success).toBe('boolean')
        expect(typeof response.body.summary).toBe('string')
        expect(typeof response.body.topics).toBe('string')
        expect(['string', 'object', 'undefined']).toContain(
          typeof response.body.mindMap
        )
        expect(['string', 'undefined']).toContain(
          typeof response.body.socialPost
        )
        expect(['string', 'undefined']).toContain(
          typeof response.body.customOutput
        )
      })

      test('should return correct error response structure', async () => {
        const requestBody = {
          transcript: '',
          purpose: Purpose.Learning,
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
