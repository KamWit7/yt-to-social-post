import { TemperatureMode } from '@/utils/modelTemperature'
import { z } from 'zod'
import {
  DEFAULT_PURPOSE,
  FORM_FIELD_NAMES,
} from '../../TasncriptionForms.constants'
import {
  AIModels,
  DEFAULT_AI_MODEL,
  DEFAULT_TEMPERATURE_MODE,
  Dictionary,
} from '../Form.constants'

export const purposeSchema = z
  .object({
    [FORM_FIELD_NAMES.PURPOSE]: z
      .enum(Object.values(Dictionary.Purpose))
      .default(DEFAULT_PURPOSE)
      .refine((val) => val && val.trim().length > 0, {
        message: 'Wybierz cel transkrypcji',
      }),
    [FORM_FIELD_NAMES.LANGUAGE]: z
      .enum([Dictionary.Language.Polish, Dictionary.Language.English])
      .default(Dictionary.Language.Polish),
    [FORM_FIELD_NAMES.CUSTOM_PROMPT]: z.string().trim(),
    [FORM_FIELD_NAMES.MODEL]: z
      .enum([
        AIModels.Gemini25Pro,
        AIModels.Gemini25Flash,
        AIModels.Gemini25FlashLite,
      ])
      .default(DEFAULT_AI_MODEL),
    [FORM_FIELD_NAMES.TEMPERATURE_MODE]: z
      .enum([
        TemperatureMode.PRECISE,
        TemperatureMode.BALANCED,
        TemperatureMode.CREATIVE,
      ] as const)
      .default(DEFAULT_TEMPERATURE_MODE),
  })
  .superRefine((data, ctx) => {
    const isCustomPurpose = data[FORM_FIELD_NAMES.PURPOSE] === DEFAULT_PURPOSE
    const customPrompt = data[FORM_FIELD_NAMES.CUSTOM_PROMPT]?.trim() ?? ''
    if (isCustomPurpose && customPrompt.length === 0) {
      ctx.addIssue({
        code: DEFAULT_PURPOSE,
        path: [FORM_FIELD_NAMES.CUSTOM_PROMPT],
        message: 'Wpisz własny prompt',
      })
    }
  })

export type PurposeOnlyFormData = z.input<typeof purposeSchema>
