import { describe, expect, test } from '@jest/globals'
import { DictionaryQuerySchema } from '../../src/validations/dictionary.validations'

describe('Dictionary Validations', () => {
  describe('DictionaryQuerySchema', () => {
    test('should validate with code=purpose', () => {
      const result = DictionaryQuerySchema.safeParse({ code: 'purpose' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.code).toBe('purpose')
      }
    })

    test('should reject missing code', () => {
      const result = DictionaryQuerySchema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        expect(result.error.issues[0]?.path).toEqual(['code'])
      }
    })

    test('should reject invalid code value', () => {
      const result = DictionaryQuerySchema.safeParse({ code: 'unknown' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
        expect(result.error.issues[0]?.path).toEqual(['code'])
      }
    })
  })
})
