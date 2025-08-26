import { z } from 'zod'
import { AIModels, DEFAULT_AI_MODEL } from '../constants/ai'
import { Dictionary } from '../constants/dictionaries'

export const ProcessTranscriptRequestSchema = z.object({
  transcript: z.string().refine((val) => val && val.trim().length > 0, {
    message: 'Transkrypcja nie może być pusta',
  }),
  purpose: z.enum(Object.values(Dictionary.Purpose) as [string, ...string[]]),
  language: z.enum(['pl', 'en']).default('pl'),
  customPrompt: z.preprocess((val) => {
    if (val === null || val === undefined) return undefined
    const str = String(val).trim()
    return str.length > 0 ? str : undefined
  }, z.string().min(1).optional()),
  model: z.enum(Object.values(AIModels)).default(DEFAULT_AI_MODEL),
})

export type ProcessTranscriptRequest = z.infer<
  typeof ProcessTranscriptRequestSchema
>
