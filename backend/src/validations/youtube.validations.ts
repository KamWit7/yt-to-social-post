import { z } from 'zod'

export const YouTubeTranscriptRequestSchema = z.object({
  url: z.string().refine(
    (url) => {
      try {
        new URL(url)
        return url.includes('youtube.com') || url.includes('youtu.be')
      } catch {
        return false
      }
    },
    { message: 'Nieprawidłowy URL YouTube' }
  ),
})

export const YouTubeVideoIdSchema = z.object({
  videoId: z.string().min(11, 'Nieprawidłowe ID filmu YouTube'),
})

export type YouTubeTranscriptRequest = z.infer<
  typeof YouTubeTranscriptRequestSchema
>
export type YouTubeVideoIdRequest = z.infer<typeof YouTubeVideoIdSchema>
