'use server'

import {
  RegisterFormData,
  registerSchema,
} from '@/components/auth/RegisterForm'
import { createUser, findUserByEmail } from '../db/users'

type RegisterUserActionReturn = {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string | null
  }
}

export async function registerUser(
  formData: RegisterFormData
): Promise<RegisterUserActionReturn> {
  try {
    const validatedData = registerSchema.parse(formData)

    const user = await findUserByEmail(validatedData.email)
    if (user) {
      return {
        message: 'User with this email already exists',
        success: false,
      }
    }

    const newUser = await createUser({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    })

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        email: newUser.email,
        id: newUser.id,
        name: newUser.name,
      },
    }
  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred during registration',
    }
  }
}
