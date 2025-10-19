'use server'

import {
  RegisterFormData,
  registerSchema,
} from '@/components/auth/RegisterForm'
import { FORM_FIELD_NAMES } from '@/components/auth/RegisterForm/RegisterForm.helpers'
import { createUser, findUserByEmail } from '../db/users'

type RegisterUserActionReturn =
  | {
      message: string
      error?: never
      user?: {
        id: string
        email: string
        name: string | null
      }
    }
  | {
      message?: never
      error?: {
        [key in
          | (typeof FORM_FIELD_NAMES)[keyof typeof FORM_FIELD_NAMES]
          | 'other']?: string
      }
      user?: never
    }

export async function registerUser(
  formData: RegisterFormData
): Promise<RegisterUserActionReturn> {
  try {
    const validatedData = registerSchema.parse(formData)
    const user = await findUserByEmail(validatedData.email)
    if (user) {
      return {
        error: {
          [FORM_FIELD_NAMES.EMAIL]: 'użytkownik o tym emailu już istnieje',
        },
      }
    }

    const newUser = await createUser({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    })

    return {
      message: 'użytkownik został zarejestrowany pomyślnie',
      user: {
        email: newUser.email,
        id: newUser.id,
        name: newUser.name,
      },
    }
  } catch (error) {
    console.error(
      'Registration error:',
      error instanceof Error ? error.message : 'Unknown error'
    )

    return {
      error: {
        other: 'wystąpił nieoczekiwany błąd podczas rejestracji',
      },
    }
  }
}
