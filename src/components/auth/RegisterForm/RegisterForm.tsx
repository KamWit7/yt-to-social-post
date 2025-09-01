'use client'

import { ControlledInput, SubmitButton } from '@/components/common'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ROUTES } from '@/utils/constants'
import { FORM_FIELD_NAMES, RegisterDefaultValues } from './RegisterForm.helpers'
import { registerSchema, type RegisterFormData } from './registerSchema'

type RegisterFormProps = {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: RegisterDefaultValues,
  })

  const { handleSubmit } = methods

  const onFormSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you would call your registration API here
      // For now, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      onSuccess?.()
      setTimeout(() => {
        router.push(ROUTES.LOGIN)
      }, 2000)
    } catch {
      const errorMessage =
        'An error occurred during registration. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-4'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
              <UserPlus className='w-6 h-6 text-green-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold'>
                Registration Successful!
              </h3>
              <p className='text-sm text-muted-foreground mt-2'>
                Your account has been created. Redirecting to login...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <ControlledInput
                name={FORM_FIELD_NAMES.NAME}
                label='Full Name'
                type='text'
                placeholder='Enter your full name'
                required
                disabled={isLoading}
                icon={<User className='w-4 h-4' />}
                autoComplete='name'
              />

              <ControlledInput
                name={FORM_FIELD_NAMES.EMAIL}
                label='Email'
                type='email'
                placeholder='Enter your email'
                required
                disabled={isLoading}
                icon={<Mail className='w-4 h-4' />}
                autoComplete='email'
              />

              <ControlledInput
                name={FORM_FIELD_NAMES.PASSWORD}
                label='Password'
                type='password'
                placeholder='Create a password'
                required
                disabled={isLoading}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />

              <ControlledInput
                name={FORM_FIELD_NAMES.CONFIRM_PASSWORD}
                label='Confirm Password'
                type='password'
                placeholder='Confirm your password'
                required
                disabled={isLoading}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />
            </div>

            {error && (
              <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                {error}
              </div>
            )}

            <SubmitButton
              isLoading={isLoading}
              loadingText='Creating account...'
              normalText='Create Account'
              icon={UserPlus}
              className='w-full'
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
