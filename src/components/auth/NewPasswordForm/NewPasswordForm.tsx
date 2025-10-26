'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/utils/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  newPasswordSchema,
  type NewPasswordFormData,
} from './NewPasswordForm.validation'
import {
  ControlledInput,
  FormServerError,
  SubmitButton,
} from '@/components/common'
import SuccessCard from '@/components/common/SuccessCard'

const FORM_FIELD_NAMES = {
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
} as const

const NewPasswordDefaultValues: NewPasswordFormData = {
  password: '',
  confirmPassword: '',
}

export default function NewPasswordForm({ token }: { token: string | null }) {
  const router = useRouter()
  const [isSuccess, setIsSuccess] = useState(false)

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
            : 'Wystąpił nieoczekiwany błąd podczas resetowania hasła',
      })
    }
  }

  if (isSuccess) {
    return (
      <SuccessCard
        title='Hasło zmienione!'
        description={`Twoje hasło zostało pomyślnie zmienione. \n Możesz teraz zalogować się do swojego konta.`}
        buttonText='Przejdź do logowania'
        onButtonClick={() => router.push(ROUTES.LOGIN)}
      />
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
