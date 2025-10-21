'use client'

import {
  ControlledInput,
  FormServerError,
  SubmitButton,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/utils/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound, Lock } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  newPasswordSchema,
  type NewPasswordFormData,
} from './NewPasswordForm.validation'

const FORM_FIELD_NAMES = {
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
} as const

const NewPasswordDefaultValues: NewPasswordFormData = {
  password: '',
  confirmPassword: '',
}

export default function NewPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const methods = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onChange',
    defaultValues: NewPasswordDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    setError: setFormError,
  } = methods

  const onFormSubmit = async (data: NewPasswordFormData) => {
    if (!token) {
      setFormError('root.serverError', {
        type: 'server',
        message: 'Brak tokena resetowania hasła',
      })
      return
    }

    try {
      const response = await fetch('/api/auth/request-reset/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      })

      if (!response.ok) {
        const statusText = response.statusText || 'Wystąpił błąd'
        if (response.status === 404) {
          setFormError('root.serverError', {
            type: 'server',
            message: 'Nieprawidłowy lub wygasły token resetowania hasła',
          })
          return
        }
        if (response.status === 400) {
          setFormError('root.serverError', {
            type: 'server',
            message: statusText || 'Link do resetowania hasła wygasł',
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
        message: 'Wystąpił nieoczekiwany błąd podczas resetowania hasła',
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
                Hasło zmienione!
              </h3>
              <p className='text-sm text-muted-foreground'>
                Twoje hasło zostało pomyślnie zmienione. Możesz teraz zalogować
                się do swojego konta.
              </p>
            </div>

            <Button
              onClick={() => router.push(ROUTES.LOGIN)}
              className='w-full'>
              Przejdź do logowania
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Ustaw nowe hasło</CardTitle>
        <CardDescription>wprowadź nowe hasło dla swojego konta</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <ControlledInput
                name={FORM_FIELD_NAMES.PASSWORD}
                label='nowe hasło'
                type='password'
                placeholder='Wprowadź nowe hasło'
                required
                disabled={isSubmitting || !token}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />

              <ControlledInput
                name={FORM_FIELD_NAMES.CONFIRM_PASSWORD}
                label='potwierdź hasło'
                type='password'
                placeholder='Potwierdź nowe hasło'
                required
                disabled={isSubmitting || !token}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />
            </div>

            <FormServerError error={errors.root?.serverError} />

            <SubmitButton
              isLoading={isSubmitting}
              loadingText='Resetowanie...'
              normalText='Resetuj hasło'
              icon={KeyRound}
              className='w-full'
              disabled={!token}
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
