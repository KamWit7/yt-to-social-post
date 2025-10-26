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
import { Lock, Mail, User, UserPlus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

import { registerUser } from '@/lib/actions/register'
import { FORM_FIELD_NAMES, RegisterDefaultValues } from './RegisterForm.helpers'
import {
  registerSchema,
  type RegisterFormData,
} from './RegisterForm.validation'
import { RegisterSuccessMessage } from './RegisterSuccessMessage'

export function RegisterForm() {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: RegisterDefaultValues,
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
    setError: setFormError,
    formState: { errors },
  } = methods

  const onFormSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data)

      if (!result.error) {
        return
      }

      if (result.error.other) {
        setFormError('root.serverError', {
          type: 'server',
          message: result.error.other,
        })
        return
      }

      for (const [key, value] of Object.entries(result.error)) {
        setFormError(key as keyof RegisterFormData, {
          message: value,
        })
      }
    } catch {
      setFormError('root.serverError', {
        type: 'server',
        message: 'wystąpił nieoczekiwany błąd podczas rejestracji',
      })
    }
  }

  if (isSubmitSuccessful) {
    return <RegisterSuccessMessage />
  }

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Utwórz konto</CardTitle>
        <CardDescription>
          wprowadź swoje dane, aby utworzyć nowe konto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <ControlledInput
                name={FORM_FIELD_NAMES.NAME}
                label='imię i nazwisko'
                type='text'
                placeholder='Wprowadź swoje imię i nazwisko'
                required
                disabled={isSubmitting}
                icon={<User className='w-4 h-4' />}
                autoComplete='name'
              />

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

              <ControlledInput
                name={FORM_FIELD_NAMES.PASSWORD}
                label='hasło'
                type='password'
                placeholder='Utwórz hasło'
                required
                disabled={isSubmitting}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />

              <ControlledInput
                name={FORM_FIELD_NAMES.CONFIRM_PASSWORD}
                label='potwierdź hasło'
                type='password'
                placeholder='Potwierdź swoje hasło'
                required
                disabled={isSubmitting}
                icon={<Lock className='w-4 h-4' />}
                autoComplete='new-password'
              />
            </div>

            <FormServerError error={errors.root?.serverError} />

            <SubmitButton
              isLoading={isSubmitting}
              loadingText='Tworzenie konta...'
              normalText='Utwórz konto'
              icon={UserPlus}
              className='w-full'
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
