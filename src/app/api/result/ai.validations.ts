import { Dictionary } from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { AIModels, DEFAULT_AI_MODEL } from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { z } from 'zod'

export const ProcessTranscriptRequestSchema = z.object({
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
    if (val === null || val === undefined) return undefined
    const str = String(val).trim()
    return str.length > 0 ? str : undefined
  }, z.string().min(1).optional()),
  model: z
    .enum([
      AIModels.Gemini25Pro,
      AIModels.Gemini25Flash,
      AIModels.Gemini25FlashLite,
    ] as const)
    .default(DEFAULT_AI_MODEL),
})

export type ProcessTranscriptRequest = z.infer<
  typeof ProcessTranscriptRequestSchema
>
