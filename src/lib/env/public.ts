'use client'

import { z } from 'zod'

// Schema dla zmiennych środowiskowych publicznych (NEXT_PUBLIC_*)
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().optional(),
})

// Walidacja zmiennych publicznych
const publicEnvResult = publicEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

if (!publicEnvResult.success) {
  console.error('❌ Invalid public environment variables:')
  console.error(publicEnvResult.error.issues)
  throw new Error('Invalid public environment variables')
}

// Eksportowane, walidowane zmienne środowiskowe publiczne
export const publicEnv = publicEnvResult.data

// API Base URL z walidacją
export const API_BASE_URL: string =
  publicEnv.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
