import type { LoginFormData } from './loginSchema'

export const LoginDefaultValues: LoginFormData = {
  email: '',
  password: '',
}

export const FORM_FIELD_NAMES = {
  EMAIL: 'email' as const,
  PASSWORD: 'password' as const,
} as const

/**
 * Authentication error messages for LoginForm
 */
export const LOGIN_AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  GOOGLE_AUTH_FAILED: 'Google sign-in failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const
