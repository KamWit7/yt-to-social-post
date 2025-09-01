import type { LoginFormData } from './loginSchema'

export const LoginDefaultValues: LoginFormData = {
  email: '',
  password: '',
}

export const FORM_FIELD_NAMES = {
  EMAIL: 'email' as const,
  PASSWORD: 'password' as const,
} as const
