import { z } from 'zod'
import { Dictionary } from '../constants/dictionaries'

export const ProcessTranscriptOptionsSchema = z
  .object({
    generateMindMap: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.boolean().optional()
    ),
    generateSocialPost: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.boolean().optional()
    ),
    customPrompt: z.preprocess(
      (val) => (val === null ? undefined : val),
      z.string().optional()
    ),
  })
  .refine(
    (data) => {
      const hasValidCustomPrompt =
        data.customPrompt && data.customPrompt.trim().length > 0
      return (
        data.generateMindMap === true ||
        data.generateSocialPost === true ||
        hasValidCustomPrompt
      )
    },
    {
      message:
        'Musisz wybrać przynajmniej jedną opcję: generateMindMap, generateSocialPost lub customPrompt',
      path: ['options'],
    }
  )

export const ProcessTranscriptRequestSchema = z.object({
  transcript: z.string().refine((val) => val && val.trim().length > 0, {
    message: 'Transkrypcja nie może być pusta',
  }),
  purpose: z.enum(Object.values(Dictionary.Purpose) as [string, ...string[]]),
  options: ProcessTranscriptOptionsSchema,
})

export type ProcessTranscriptRequest = z.infer<
  typeof ProcessTranscriptRequestSchema
>
export type ProcessTranscriptOptions = z.infer<
  typeof ProcessTranscriptOptionsSchema
>
