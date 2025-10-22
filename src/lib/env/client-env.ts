'use client'

import { z } from 'zod'

// Client-side environment variables (only NEXT_PUBLIC_* variables are available on the client)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().min(1, 'NEXT_PUBLIC_API_URL is required'),
})

// WTF -> https://stackoverflow.com/questions/77255954/validating-environment-variables-in-next-js-with-zod
export const clientEnv: z.infer<typeof clientEnvSchema> = clientEnvSchema.parse(
  {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
)
