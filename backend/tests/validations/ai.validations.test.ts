import { describe, expect, test } from '@jest/globals'
import { Dictionary } from '../../src/constants/dictionaries'
import {
  ProcessTranscriptRequest,
  ProcessTranscriptRequestSchema,
} from '../../src/validations/ai.validations'

describe('AI Validations', () => {
  describe('Purpose Enum', () => {
    test('should have correct purpose values', () => {
      expect(Dictionary.Purpose.Learning).toBe('learning')
      expect(Dictionary.Purpose.SocialMedia).toBe('social_media')
      expect(Dictionary.Purpose.Custom).toBe('custom')
    })

    test('should have all required purpose values', () => {
      const purposes = Object.values(Dictionary.Purpose)
      expect(purposes).toContain('learning')
      expect(purposes).toContain('social_media')
      expect(purposes).toContain('custom')
      expect(purposes).toHaveLength(3)
    })
  })

  // options schema is removed in the new API

  describe('ProcessTranscriptRequestSchema', () => {
    describe('Valid Requests', () => {
      test('should validate minimal valid request with Learning purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({
            ...validRequest,
            model: 'gemini-2.5-pro',
          })
        }
      })

      test('should validate minimal valid request with SocialMedia purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.SocialMedia,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({
            ...validRequest,
            model: 'gemini-2.5-pro',
          })
        }
      })

      test('should validate minimal valid request with Custom purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Analyze this transcript',
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual({
            ...validRequest,
            model: 'gemini-2.5-pro',
          })
        }
      })

      test('should validate request with very long transcript', () => {
        const longTranscript = 'A'.repeat(50000)
        const validRequest = {
          transcript: longTranscript,
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Analyze this long transcript',
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.transcript).toBe(longTranscript)
        }
      })

      test('should validate request with special characters in transcript', () => {
        const specialTranscript =
          'Transkrypcja z polskimi znakami: ąćęłńóśźż i emoji 🚀'
        const validRequest = {
          transcript: specialTranscript,
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.transcript).toBe(specialTranscript)
        }
      })

      test('should validate request with explicit model gemini-2.5-pro', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Learning,
          model: 'gemini-2.5-pro' as const,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.model).toBe('gemini-2.5-pro')
        }
      })

      test('should validate request with explicit model gemini-2.5-flash', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.SocialMedia,
          model: 'gemini-2.5-flash' as const,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.model).toBe('gemini-2.5-flash')
        }
      })

      test('should validate request with explicit model gemini-2.5-flash-lite', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Analyze',
          model: 'gemini-2.5-flash-lite' as const,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.model).toBe('gemini-2.5-flash-lite')
        }
      })

      test('should default model to gemini-2.5-pro when missing', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.model).toBe('gemini-2.5-pro')
        }
      })
    })

    describe('Invalid Requests', () => {
      test('should reject request without transcript', () => {
        const invalidRequest = {
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0]?.message).toBe(
            'Invalid input: expected string, received undefined'
          )
          expect(result.error.issues[0]?.path).toEqual(['transcript'])
        }
      })

      test('should reject request with empty transcript', () => {
        const invalidRequest = {
          transcript: '',
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0]?.message).toBe(
            'Transkrypcja nie może być pusta'
          )
        }
      })

      test('should reject request with whitespace-only transcript', () => {
        const invalidRequest = {
          transcript: '   ',
          purpose: Dictionary.Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0]?.message).toBe(
            'Transkrypcja nie może być pusta'
          )
        }
      })

      test('should reject request without purpose', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0]?.path).toEqual(['purpose'])
        }
      })

      test('should reject request with invalid purpose', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          purpose: 'invalid_purpose',
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0]?.path).toEqual(['purpose'])
        }
      })
      test('should reject request with multiple validation errors', () => {
        const invalidRequest = {
          transcript: '',
          purpose: 'invalid_purpose',
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(1)
        }
      })

      test('should reject request with invalid model', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          purpose: Dictionary.Purpose.Learning,
          model: 'invalid-model',
        } as any

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
      })
    })

    describe('Type Inference', () => {
      test('should correctly infer ProcessTranscriptRequest type', () => {
        const validRequest: ProcessTranscriptRequest = {
          transcript: 'Test transcript',
          purpose: Dictionary.Purpose.Learning,
          model: 'gemini-2.5-pro',
        }

        expect(validRequest.transcript).toBe('Test transcript')
        expect(validRequest.purpose).toBe(Dictionary.Purpose.Learning)
        expect(validRequest.model).toBe('gemini-2.5-pro')
      })
    })

    describe('Integration with Zod', () => {
      test('should work with Zod parse method', () => {
        const validRequest = {
          transcript: 'Test transcript',
          purpose: Dictionary.Purpose.Custom,
          customPrompt: 'Test prompt',
        }

        const result = ProcessTranscriptRequestSchema.parse(validRequest)
        expect(result).toEqual({
          ...validRequest,
          model: 'gemini-2.5-pro',
        })
      })

      test('should throw error with Zod parse method for invalid data', () => {
        const invalidRequest = {
          transcript: '',
          purpose: 'invalid',
        }

        expect(() =>
          ProcessTranscriptRequestSchema.parse(invalidRequest)
        ).toThrow()
      })
    })
  })
})
