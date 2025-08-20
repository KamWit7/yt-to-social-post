import { z } from 'zod'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'

export const purposeSchema = z
  .object({
    [FORM_FIELD_NAMES.PURPOSE]: z.string().min(1, 'Wybierz cel transkrypcji'),
    [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: z.string().optional(),
    options: z
      .object({
        generateMindMap: z.boolean().optional(),
        generateSocialPost: z.boolean().optional(),
        customPrompt: z.string().optional(),
        generateSummary: z.boolean().optional(),
        generateKeyPoints: z.boolean().optional(),
        generateQuestions: z.boolean().optional(),
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
        data[FORM_FIELD_NAMES.PURPOSE] === 'custom' &&
        (!data.options?.customPrompt ||
          data.options.customPrompt.trim().length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: 'Wprowadź własne polecenie',
      path: ['options', 'customPrompt'],
    }
  )
