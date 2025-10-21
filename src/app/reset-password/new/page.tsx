import { NewPasswordForm } from '@/components/auth/NewPasswordForm'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ustaw nowe hasło | YT Scribe',
  description: 'ustaw nowe hasło, aby uzyskać dostęp do swojego konta',
}

export default function NewResetPasswordPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Ustaw nowe hasło</h1>
          <p className='text-muted-foreground'>
            wprowadź nowe hasło dla swojego konta
          </p>
        </div>

        <NewPasswordForm />

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
