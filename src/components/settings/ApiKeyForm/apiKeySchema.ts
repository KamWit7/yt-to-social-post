import { z } from 'zod'

/**
 * Validation schema for Google Gemini API key form
 */
export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, 'Please enter your Google Gemini API key')
    .regex(
      /^AIza[0-9A-Za-z-_]{35}$/,
      'Invalid API key format. Please check your Google Gemini API key.'
    ),
})

/**
 * Type definition for API key form data
 */
export type ApiKeyFormData = z.infer<typeof apiKeySchema>
