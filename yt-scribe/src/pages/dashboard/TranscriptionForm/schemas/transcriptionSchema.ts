import { FORM_FIELD_NAMES } from '@/pages/dashboard/TranscriptionForm/constants/formConstants'
import { YOUTUBE_URL_PATTERNS } from '@/utils/constants'
import { z } from 'zod'

export const transcriptionSchema = z
  .object({
    [FORM_FIELD_NAMES.URL]: z
      .string()
      .min(1, 'Link YouTube jest wymagany')
      .refine(
        (url) =>
          YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url.trim())),
        'Proszę wprowadzić prawidłowy link YouTube'
      ),
    [FORM_FIELD_NAMES.PURPOSE]: z.string().min(1, 'Wybierz cel transkrypcji'),
    [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data[FORM_FIELD_NAMES.PURPOSE] === 'Inny' &&
        (!data[FORM_FIELD_NAMES.CUSTOM_PURPOSE] ||
          data[FORM_FIELD_NAMES.CUSTOM_PURPOSE]?.trim().length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: 'Wprowadź własny cel transkrypcji',
      path: [FORM_FIELD_NAMES.CUSTOM_PURPOSE],
    }
  )

export type TranscriptionFormData = z.infer<typeof transcriptionSchema>
