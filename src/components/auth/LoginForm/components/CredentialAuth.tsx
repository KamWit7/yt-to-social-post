'use client'

import { ControlledInput, SubmitButton } from '@/components/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { ROUTES } from '@/utils/constants'
import {
  FORM_FIELD_NAMES,
  LOGIN_AUTH_ERRORS,
  LoginDefaultValues,
} from '../LoginForm.helpers'
import { loginSchema, type LoginFormData } from '../loginSchema'

interface CredentialAuthProps {
  onLoadingChange?: (isLoading: boolean) => void
  isDisabled?: boolean
}

export function CredentialAuth({
  onLoadingChange,
  isDisabled = false,
}: CredentialAuthProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: LoginDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  // Notify parent component about loading state changes
  React.useEffect(() => {
    onLoadingChange?.(isSubmitting)
  }, [isSubmitting, onLoadingChange])

  const signInWithCredentials = useCallback(
    async (data: LoginFormData): Promise<boolean> => {
      setError(null)

      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })

        console.log('result', result)

        if (result?.error) {
          setError(LOGIN_AUTH_ERRORS.INVALID_CREDENTIALS)
          return false
        } else {
          // Successful authentication - navigate to dashboard
          router.push(ROUTES.DASHBOARD)
          router.refresh()

          return true
        }
      } catch (networkError) {
        console.error('Network error during authentication:', networkError)
        setError(LOGIN_AUTH_ERRORS.NETWORK_ERROR)
        return false
      }
    },
    [router]
  )

  const onFormSubmit = async (data: LoginFormData) => {
    await signInWithCredentials(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
        <div className='space-y-4'>
          <ControlledInput
            name={FORM_FIELD_NAMES.EMAIL}
            label='Email'
            type='email'
            placeholder='Wprowadź swój email'
            required
            disabled={isSubmitting || isDisabled}
            icon={<Mail className='w-4 h-4' />}
            autoComplete='email'
          />

          <ControlledInput
            name={FORM_FIELD_NAMES.PASSWORD}
            label='Hasło'
            type='password'
            placeholder='Wprowadź swoje hasło'
            required
            disabled={isSubmitting || isDisabled}
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
          isLoading={isSubmitting}
          loadingText='Logowanie...'
          normalText='Zaloguj się'
          icon={LogIn}
          className='w-full'
          disabled={isDisabled}
        />
      </form>
    </FormProvider>
  )
}
