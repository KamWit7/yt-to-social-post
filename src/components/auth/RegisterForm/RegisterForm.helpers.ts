import type { RegisterFormData } from './registerSchema'

export const RegisterDefaultValues: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const FORM_FIELD_NAMES = {
  NAME: 'name' as const,
  EMAIL: 'email' as const,
  PASSWORD: 'password' as const,
  CONFIRM_PASSWORD: 'confirmPassword' as const,
} as const
