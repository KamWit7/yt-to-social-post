export * from './ai.validations'
export * from './dictionary.validations'
export * from './youtube.validations'

import { z } from 'zod'

export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T => {
  return schema.parse(data)
}

export const validateRequestSafe = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, errors: result.error }
}
