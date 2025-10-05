import { z } from 'zod'

// Schema dla zmiennych środowiskowych serwerowych
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.url().optional(),

  // Google OAuth (opcjonalne)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // API Encryption Key
  API_ENCRYPTION_KEY: z
    .string()
    .min(
      64,
      'API_ENCRYPTION_KEY is not set or is not a 64-character hex string.'
    ),

  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
})

// Walidacja zmiennych serwerowych
const serverEnvResult = serverEnvSchema.safeParse(process.env)

if (!serverEnvResult.success) {
  console.error('❌ Invalid server environment variables:')
  console.error(serverEnvResult.error.issues)
  throw new Error('Invalid server environment variables')
}

// Eksportowane, walidowane zmienne środowiskowe serwerowe
export const serverEnv = serverEnvResult.data

// Helper function to check if Google OAuth is configured
function isGoogleOAuthConfigured(): boolean {
  return !!(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET)
}

// Helper function to get Google OAuth credentials
export function getGoogleOAuthCredentials(): {
  clientId: string
  clientSecret: string
} {
  if (!isGoogleOAuthConfigured()) {
    throw new Error(
      'Google OAuth credentials are not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.'
    )
  }

  return {
    clientId: serverEnv.GOOGLE_CLIENT_ID!,
    clientSecret: serverEnv.GOOGLE_CLIENT_SECRET!,
  }
}
