import { z } from 'zod'

// Schema dla zmiennych środowiskowych serwerowych
const safeEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  NEXTAUTH_URL: z.url().min(1, 'NEXTAUTH_URL is required'),

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

  // Gemini API Key
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

  // Cron Secret
  CRON_SECRET: z.string().min(1, 'CRON_SECRET is required'),

  // Email User
  EMAIL_USER: z.string().min(1, 'EMAIL_USER is required'),

  // Email Password
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required'),

  // API Base URL
  NEXT_PUBLIC_API_URL: z.url().min(1, 'NEXT_PUBLIC_API_URL is required'),
})

console.log('ENV',process.env)
export const safeEnv = safeEnvSchema.parse(process.env)

// Helper function to check if Google OAuth is configured
function isGoogleOAuthConfigured(): boolean {
  return !!(safeEnv.GOOGLE_CLIENT_ID && safeEnv.GOOGLE_CLIENT_SECRET)
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
    clientId: safeEnv.GOOGLE_CLIENT_ID!,
    clientSecret: safeEnv.GOOGLE_CLIENT_SECRET!,
  }
}
