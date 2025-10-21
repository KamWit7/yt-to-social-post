'use client'

import {
  ControlledInput,
  FormServerError,
  SubmitButton,
} from '@/components/common'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from './ResetPasswordForm.validation'

const FORM_FIELD_NAMES = {
  EMAIL: 'email',
} as const

const ResetPasswordDefaultValues: ResetPasswordFormData = {
  email: '',
}

export function ResetPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false)

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: ResetPasswordDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError: setFormError,
  } = methods

  const onFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const statusText = response.statusText || 'Wystąpił błąd'
        if (response.status === 404) {
          setFormError('email', {
            message: 'Nie znaleziono użytkownika z tym adresem email',
          })
          return
        }
        setFormError('root.serverError', {
          type: 'server',
          message: statusText,
        })
        return
      }

      setIsSuccess(true)
    } catch {
      setFormError('root.serverError', {
        type: 'server',
        message: 'Wystąpił nieoczekiwany błąd podczas wysyłania emaila',
      })
    }
  }

  if (isSuccess) {
    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-6'>
            <div className='relative'>
              <div className='w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                <CheckCircle2 className='w-8 h-8 text-green-600' />
              </div>
              <div className='absolute inset-0 w-16 h-16 bg-green-200 rounded-full mx-auto animate-ping opacity-20'></div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-green-800'>
                Email wysłany!
              </h3>
              <p className='text-sm text-muted-foreground'>
                link do resetowania hasła został wysłany na Twój adres email.
                Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z
                instrukcjami.
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
        <CardTitle>Resetuj hasło</CardTitle>
        <CardDescription>
          wprowadź swój adres email, a wyślemy Ci link do resetowania hasła
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <ControlledInput
                name={FORM_FIELD_NAMES.EMAIL}
                label='email'
                type='email'
                placeholder='Wprowadź swój email'
                required
                disabled={isSubmitting}
                icon={<Mail className='w-4 h-4' />}
                autoComplete='email'
              />
            </div>

            <FormServerError error={errors.root?.serverError} />

            <SubmitButton
              isLoading={isSubmitting}
              loadingText='Wysyłanie...'
              normalText='Wyślij link resetujący'
              icon={Send}
              className='w-full'
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
