import type { RegisterFormData } from './RegisterForm.validation'

export const RegisterDefaultValues: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export const FORM_FIELD_NAMES = {
  NAME: 'name',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
} as const

export const FORM_FIELD_ERRORS = {
  BACKEND_ERROR: 'other',
}
