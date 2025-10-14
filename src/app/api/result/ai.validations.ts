import {
  AIModels,
  Dictionary,
} from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { TemperatureMode } from '@/utils/modelTemperature'
import { AccountTier } from '@prisma/client'
import { z } from 'zod'

const CommonSchema = z.object({
  accountTier: z.string().optional(),
  transcript: z.string().refine((val) => val && val.trim().length > 0, {
    message: 'Transkrypcja nie może być pusta',
  }),
  purpose: z.enum([
    Dictionary.Purpose.SocialMedia,
    Dictionary.Purpose.Custom,
    Dictionary.Purpose.Summary,
    Dictionary.Purpose.Topics,
  ] as const),
  language: z
    .enum([Dictionary.Language.Polish, Dictionary.Language.English] as const)
    .default(Dictionary.Language.Polish),
  customPrompt: z.preprocess((val) => {
    if (val === null || val === undefined) {
      return
    }
    const str = String(val).trim()

    return str.length > 0 ? str : undefined
  }, z.string().min(1).optional()),
})

export const ProcessTranscriptRequestSchema = z
  .discriminatedUnion('accountTier', [
    z.object({
      accountTier: z.literal(AccountTier.BYOK),
      model: z.enum([
        AIModels.Gemini25Pro,
        AIModels.Gemini25Flash,
        AIModels.Gemini25FlashLite,
      ] as const),
      temperatureMode: z.enum([
        TemperatureMode.PRECISE,
        TemperatureMode.BALANCED,
        TemperatureMode.CREATIVE,
      ] as const),
    }),

    z.object({
      accountTier: z.literal(AccountTier.free),
      model: z.enum([AIModels.Gemini25Flash] as const),
      temperatureMode: z.enum([TemperatureMode.BALANCED] as const),
    }),
  ])
  .and(CommonSchema)

export type ProcessTranscriptRequest = Omit<
  z.infer<typeof ProcessTranscriptRequestSchema>,
  'accountTier'
> & { accountTier?: AccountTier }
