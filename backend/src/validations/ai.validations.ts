import { z } from 'zod'

export const Purpose = {
  Learning: 'learning',
  SocialMedia: 'social_media',
  Custom: 'custom',
} as const

export const ProcessTranscriptOptionsSchema = z
  .object({
    generateMindMap: z.boolean().optional(),
    generateSocialPost: z.boolean().optional(),
    customPrompt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.generateMindMap || data.generateSocialPost || data.customPrompt,
    {
      message:
        'Musisz wybrać przynajmniej jedną opcję: generateMindMap, generateSocialPost lub customPrompt',
      path: ['options'],
    }
  )

export const ProcessTranscriptRequestSchema = z.object({
  transcript: z.string().min(1, 'Transkrypcja nie może być pusta'),
  purpose: z.enum(Object.values(Purpose)),
  options: ProcessTranscriptOptionsSchema,
})

export type ProcessTranscriptRequest = z.infer<
  typeof ProcessTranscriptRequestSchema
>
export type ProcessTranscriptOptions = z.infer<
  typeof ProcessTranscriptOptionsSchema
>
