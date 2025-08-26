import { z } from 'zod'

export const DictionaryQuerySchema = z
  .object({
    code: z.enum(['purpose', 'language']),
  })
  .refine((data) => data.code !== undefined, {
    message: 'Parametr "code" jest wymagany',
    path: ['code'],
  })

export type DictionaryQuery = z.infer<typeof DictionaryQuerySchema>
