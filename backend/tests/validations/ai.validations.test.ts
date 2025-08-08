import { describe, expect, test } from '@jest/globals'
import {
  ProcessTranscriptOptions,
  ProcessTranscriptOptionsSchema,
  ProcessTranscriptRequest,
  ProcessTranscriptRequestSchema,
  Purpose,
} from '../../src/validations/ai.validations'

describe('AI Validations', () => {
  describe('Purpose Enum', () => {
    test('should have correct purpose values', () => {
      expect(Purpose.Learning).toBe('learning')
      expect(Purpose.SocialMedia).toBe('social_media')
      expect(Purpose.Custom).toBe('custom')
    })

    test('should have all required purpose values', () => {
      const purposes = Object.values(Purpose)
      expect(purposes).toContain('learning')
      expect(purposes).toContain('social_media')
      expect(purposes).toContain('custom')
      expect(purposes).toHaveLength(3)
    })
  })

  describe('ProcessTranscriptOptionsSchema', () => {
    describe('Valid Options', () => {
      test('should validate with generateMindMap only', () => {
        const validOptions = {
          generateMindMap: true,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })

      test('should validate with generateSocialPost only', () => {
        const validOptions = {
          generateSocialPost: true,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })

      test('should validate with customPrompt only', () => {
        const validOptions = {
          customPrompt: 'Analyze this transcript',
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })

      test('should validate with multiple options', () => {
        const validOptions = {
          generateMindMap: true,
          generateSocialPost: false,
          customPrompt: 'Custom analysis',
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })

      test('should validate with all options as true', () => {
        const validOptions = {
          generateMindMap: true,
          generateSocialPost: true,
          customPrompt: 'Full analysis',
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })

      test('should validate with empty customPrompt', () => {
        const validOptions = {
          generateMindMap: true,
          customPrompt: '',
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validOptions)
        }
      })
    })

    describe('Invalid Options', () => {
      test('should reject empty options object', () => {
        const invalidOptions = {}

        const result = ProcessTranscriptOptionsSchema.safeParse(invalidOptions)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Musisz wybrać przynajmniej jedną opcję: generateMindMap, generateSocialPost lub customPrompt'
          )
          expect(result.error.issues[0].path).toEqual(['options'])
        }
      })

      test('should reject when all options are false or undefined', () => {
        const invalidOptions = {
          generateMindMap: false,
          generateSocialPost: false,
          customPrompt: undefined,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(invalidOptions)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Musisz wybrać przynajmniej jedną opcję: generateMindMap, generateSocialPost lub customPrompt'
          )
        }
      })

      test('should reject when customPrompt is only whitespace', () => {
        const invalidOptions = {
          customPrompt: '   ',
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(invalidOptions)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Musisz wybrać przynajmniej jedną opcję: generateMindMap, generateSocialPost lub customPrompt'
          )
        }
      })

      test('should reject invalid data types', () => {
        const invalidOptions = {
          generateMindMap: 'true', // should be boolean
          generateSocialPost: 123, // should be boolean
          customPrompt: 456, // should be string
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(invalidOptions)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(0)
        }
      })
    })

    describe('Edge Cases', () => {
      test('should validate with very long customPrompt', () => {
        const longPrompt = 'A'.repeat(10000)
        const validOptions = {
          customPrompt: longPrompt,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.customPrompt).toBe(longPrompt)
        }
      })

      test('should validate with special characters in customPrompt', () => {
        const specialPrompt =
          'Analyze with special chars: ąćęłńóśźż 🚀 @#$%^&*()'
        const validOptions = {
          customPrompt: specialPrompt,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.customPrompt).toBe(specialPrompt)
        }
      })

      test('should validate with null values (should be treated as undefined)', () => {
        const validOptions = {
          generateMindMap: true,
          generateSocialPost: null as any,
          customPrompt: null as any,
        }

        const result = ProcessTranscriptOptionsSchema.safeParse(validOptions)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.generateMindMap).toBe(true)
          expect(result.data.generateSocialPost).toBeUndefined()
          expect(result.data.customPrompt).toBeUndefined()
        }
      })
    })
  })

  describe('ProcessTranscriptRequestSchema', () => {
    describe('Valid Requests', () => {
      test('should validate minimal valid request with Learning purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validRequest)
        }
      })

      test('should validate minimal valid request with SocialMedia purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Purpose.SocialMedia,
          options: {
            generateSocialPost: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validRequest)
        }
      })

      test('should validate minimal valid request with Custom purpose', () => {
        const validRequest = {
          transcript: 'This is a test transcript',
          purpose: Purpose.Custom,
          options: {
            customPrompt: 'Analyze this transcript',
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validRequest)
        }
      })

      test('should validate request with all options', () => {
        const validRequest = {
          transcript: 'This is a comprehensive test transcript',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
            generateSocialPost: false,
            customPrompt: 'Detailed analysis',
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validRequest)
        }
      })

      test('should validate request with very long transcript', () => {
        const longTranscript = 'A'.repeat(50000)
        const validRequest = {
          transcript: longTranscript,
          purpose: Purpose.Custom,
          options: {
            customPrompt: 'Analyze this long transcript',
          },
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
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(validRequest)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.transcript).toBe(specialTranscript)
        }
      })
    })

    describe('Invalid Requests', () => {
      test('should reject request without transcript', () => {
        const invalidRequest = {
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Transkrypcja nie może być pusta'
          )
          expect(result.error.issues[0].path).toEqual(['transcript'])
        }
      })

      test('should reject request with empty transcript', () => {
        const invalidRequest = {
          transcript: '',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Transkrypcja nie może być pusta'
          )
        }
      })

      test('should reject request with whitespace-only transcript', () => {
        const invalidRequest = {
          transcript: '   ',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].message).toBe(
            'Transkrypcja nie może być pusta'
          )
        }
      })

      test('should reject request without purpose', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].path).toEqual(['purpose'])
        }
      })

      test('should reject request with invalid purpose', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          purpose: 'invalid_purpose',
          options: {
            generateMindMap: true,
          },
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].path).toEqual(['purpose'])
        }
      })

      test('should reject request without options', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          purpose: Purpose.Learning,
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].path).toEqual(['options'])
        }
      })

      test('should reject request with invalid options', () => {
        const invalidRequest = {
          transcript: 'This is a test transcript',
          purpose: Purpose.Learning,
          options: {}, // Empty options should fail
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toHaveLength(1)
          expect(result.error.issues[0].path).toEqual(['options'])
        }
      })

      test('should reject request with multiple validation errors', () => {
        const invalidRequest = {
          transcript: '',
          purpose: 'invalid_purpose',
          options: {},
        }

        const result = ProcessTranscriptRequestSchema.safeParse(invalidRequest)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThan(1)
        }
      })
    })

    describe('Type Inference', () => {
      test('should correctly infer ProcessTranscriptRequest type', () => {
        const validRequest: ProcessTranscriptRequest = {
          transcript: 'Test transcript',
          purpose: Purpose.Learning,
          options: {
            generateMindMap: true,
          },
        }

        expect(validRequest.transcript).toBe('Test transcript')
        expect(validRequest.purpose).toBe(Purpose.Learning)
        expect(validRequest.options.generateMindMap).toBe(true)
      })

      test('should correctly infer ProcessTranscriptOptions type', () => {
        const validOptions: ProcessTranscriptOptions = {
          generateMindMap: true,
          generateSocialPost: false,
          customPrompt: 'Test prompt',
        }

        expect(validOptions.generateMindMap).toBe(true)
        expect(validOptions.generateSocialPost).toBe(false)
        expect(validOptions.customPrompt).toBe('Test prompt')
      })
    })

    describe('Integration with Zod', () => {
      test('should work with Zod parse method', () => {
        const validRequest = {
          transcript: 'Test transcript',
          purpose: Purpose.Custom,
          options: {
            customPrompt: 'Test prompt',
          },
        }

        const result = ProcessTranscriptRequestSchema.parse(validRequest)
        expect(result).toEqual(validRequest)
      })

      test('should throw error with Zod parse method for invalid data', () => {
        const invalidRequest = {
          transcript: '',
          purpose: 'invalid',
          options: {},
        }

        expect(() =>
          ProcessTranscriptRequestSchema.parse(invalidRequest)
        ).toThrow()
      })
    })
  })
})
