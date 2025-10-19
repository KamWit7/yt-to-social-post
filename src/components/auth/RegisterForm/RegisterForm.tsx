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
import { Progress } from '@/components/ui/progress'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { registerUser } from '@/lib/actions/register'
import { ROUTES } from '@/utils/constants'
import { FORM_FIELD_NAMES, RegisterDefaultValues } from './RegisterForm.helpers'
import { registerSchema, type RegisterFormData } from './registerSchema'

export function RegisterForm() {
  const [countdown, setCountdown] = useState<number | null>(null)
  const router = useRouter()

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

  // Timer effect for countdown
  useEffect(() => {
    if (countdown === null) {
      return
    }

    if (countdown === 0) {
      router.push(ROUTES.LOGIN)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  const onFormSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(data)

      if (result.success) {
        setCountdown(5)
      } else {
        setFormError(FORM_FIELD_NAMES.EMAIL, {
          message: result.message,
        })
      }
    } catch (error) {
      setFormError(FORM_FIELD_NAMES.EMAIL, {
        message:
          error instanceof Error
            ? error?.message
            : 'Wystąpił błąd podczas rejestracji',
      })
    }
  }

  if (isSubmitSuccessful) {
    const progressPercentage =
      countdown !== null ? ((5 - countdown) / 5) * 100 : 0

    return (
      <Card className='w-full max-w-md mx-auto'>
        <CardContent className='pt-6'>
          <div className='text-center space-y-6'>
            {/* Success Icon with Pulse Animation */}
            <div className='relative'>
              <div className='w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                <UserPlus className='w-8 h-8 text-green-600' />
              </div>
              <div className='absolute inset-0 w-16 h-16 bg-green-200 rounded-full mx-auto animate-ping opacity-20'></div>
            </div>

            {/* Success Message */}
            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-green-800'>
                Rejestracja zakończona pomyślnie!
              </h3>
              <p className='text-sm text-muted-foreground'>
                twoje konto zostało utworzone pomyślnie
              </p>
            </div>

            {/* Countdown Timer with Progress */}
            {countdown !== null && (
              <div className='space-y-4'>
                <div className='flex items-center justify-center space-x-2'>
                  <span className='text-sm text-muted-foreground'>
                    Przekierowanie do logowania za
                  </span>
                  <div className='flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full'>
                    <span className='text-sm font-bold text-primary'>
                      {countdown}
                    </span>
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {countdown === 1
                      ? 'sekundę'
                      : countdown < 5
                      ? 'sekundy'
                      : 'sekund'}
                  </span>
                </div>

                <Progress
                  value={progressPercentage}
                  className='w-full h-2 bg-gray-200'
                />

                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => router.push(ROUTES.LOGIN)}
                  className='text-sm'>
                  Przejdź do logowania teraz
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
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

            {/* TODO: Refactor this to use FormError component and create new generic field in form for backend errors */}
            {errors[FORM_FIELD_NAMES.EMAIL]?.message && (
              <div className='text-sm text-destructive bg-destructive/10 p-3 rounded-md'>
                {errors[FORM_FIELD_NAMES.EMAIL]?.message}
              </div>
            )}

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
