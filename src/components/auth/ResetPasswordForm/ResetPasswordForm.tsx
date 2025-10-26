'use client'

import {
  ControlledInput,
  FormServerError,
  SubmitButton,
  SuccessCard,
} from '@/components/common'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { AnimatedSection } from '@/components/animation'
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
        const error = (await response.json())?.message || 'Wystąpił błąd'

        throw new Error(error)
      }

      setIsSuccess(true)
    } catch (error: unknown) {
      setFormError('root.serverError', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Wystąpił nieoczekiwany błąd podczas wysyłania emaila',
      })
    }
  }

  if (isSuccess) {
    return (
      <SuccessCard
        title='Email wysłany!'
        description='link do resetowania hasła został wysłany na Twój adres email. Sprawdź swoją skrzynkę odbiorczą i postępuj zgodnie z instrukcjami.'
      />
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
        <AnimatedSection isVisible>
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
        </AnimatedSection>
      </CardContent>
    </Card>
  )
}
