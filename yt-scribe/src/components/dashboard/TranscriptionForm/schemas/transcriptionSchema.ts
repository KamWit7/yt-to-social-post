import { YOUTUBE_URL_PATTERNS } from '@/utils/constants'
import { z } from 'zod'

export const transcriptionSchema = z.object({
  url: z
    .string()
    .min(1, 'Link YouTube jest wymagany')
    .refine(
      (url) => YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url.trim())),
      'Proszę wprowadzić prawidłowy link YouTube'
    ),
  purpose: z.string().min(1, 'Wybierz cel transkrypcji'),
  customPurpose: z
    .string()
    .optional()
    .refine((value, ctx) => {
      if (
        ctx.parent.purpose === 'Inny' &&
        (!value || value.trim().length === 0)
      ) {
        return false
      }
      return true
    }, 'Wprowadź własny cel transkrypcji'),
})

export type TranscriptionFormData = z.infer<typeof transcriptionSchema>
