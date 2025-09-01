'use client'

import { ControlledInput, SubmitButton } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ROUTES } from '@/utils/constants'
import { FORM_FIELD_NAMES, LoginDefaultValues } from './LoginForm.helpers'
import { loginSchema, type LoginFormData } from './loginSchema'

type LoginFormProps = {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: LoginDefaultValues,
  })

  const { handleSubmit } = methods

  const onFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        const errorMessage = 'Invalid email or password'
        setError(errorMessage)
        onError?.(errorMessage)
      } else {
        onSuccess?.()
        router.push(ROUTES.DASHBOARD)
        router.refresh()
      }
    } catch {
      const errorMessage = 'An error occurred. Please try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: ROUTES.DASHBOARD })
    } catch {
      const errorMessage = 'An error occurred with Google sign in'
      setError(errorMessage)
      onError?.(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
            <div className='space-y-4'>
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
                placeholder='Enter your password'
                required
                disabled={isLoading}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='current-password'
              />
            </div>

            {error && (
              <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                {error}
              </div>
            )}

            <SubmitButton
              isLoading={isLoading}
              loadingText='Signing in...'
              normalText='Sign In'
              icon={LogIn}
              className='w-full'
            />
          </form>
        </FormProvider>

        <div className='mt-4'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant='outline'
            className='w-full mt-4'
            onClick={handleGoogleSignIn}
            disabled={isLoading}>
            <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
