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
  INVALID_CREDENTIALS: 'Nieprawidłowy email lub hasło',
  GOOGLE_AUTH_FAILED:
    'Logowanie przez Google nie powiodło się. Spróbuj ponownie.',
  NETWORK_ERROR: 'Błąd sieci. Sprawdź swoje połączenie.',
  UNKNOWN_ERROR: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
} as const
