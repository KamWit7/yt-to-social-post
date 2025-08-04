import { YOUTUBE_URL_PATTERNS } from '@/utils/constants'
import { z } from 'zod'
import { FORM_FIELD_NAMES } from '../constants/formConstants'

export const transcriptionSchema = z
  .object({
    [FORM_FIELD_NAMES.URL]: z
      .string()
      .optional()
      .refine(
        (url) =>
          !url ||
          YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url.trim())),
        'Proszę wprowadzić prawidłowy link YouTube'
      ),
    [FORM_FIELD_NAMES.TRANSCRIPT]: z
      .string()
      .min(1, 'Transkrypcja jest wymagana')
      .min(10, 'Transkrypcja musi mieć co najmniej 10 znaków'),
    [FORM_FIELD_NAMES.PURPOSE]: z.string().min(1, 'Wybierz cel transkrypcji'),
    [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: z.string().optional(),
    options: z
      .object({
        generateMindMap: z.boolean().optional(),
        generateSocialPost: z.boolean().optional(),
        customPrompt: z.string().optional(),
      })
      .optional(),
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
  .refine(
    (data) => {
      if (
        data[FORM_FIELD_NAMES.PURPOSE] === 'Ogólne' &&
        data.options?.customPrompt &&
        data.options.customPrompt.trim().length === 0
      ) {
        return false
      }
      return true
    },
    {
      message: 'Wprowadź własne polecenie',
      path: [FORM_FIELD_NAMES.CUSTOM_PROMPT],
    }
  )

export type TranscriptionFormData = z.infer<typeof transcriptionSchema>
