import {
  NewPasswordForm,
  NewPasswordFormSkeleton,
} from '@/components/auth/NewPasswordForm'
import { PageHeader } from '@/components/common'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Ustaw nowe hasło | YT Scribe',
  description: 'ustaw nowe hasło, aby uzyskać dostęp do swojego konta',
}

export default async function NewResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>
}) {
  const { token } = await searchParams

  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <PageHeader
          title='Ustaw nowe hasło'
          description='wprowadź nowe hasło dla swojego konta'
        />

        <Suspense fallback={<NewPasswordFormSkeleton />}>
          <NewPasswordForm token={token} />
        </Suspense>

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Pamiętasz hasło? </span>
          <Link
            href={ROUTES.LOGIN}
            className='text-primary hover:underline font-medium'>
            Zaloguj się tutaj
          </Link>
        </div>
      </div>
    </div>
  )
}
