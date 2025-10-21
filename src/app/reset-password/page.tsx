import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { ROUTES } from '@/utils/constants'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reset hasła | YT Scribe',
  description: 'resetuj swoje hasło, aby uzyskać dostęp do swojego konta',
}

export default function ResetPasswordPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Resetuj hasło</h1>
          <p className='text-muted-foreground'>
            wprowadź swój email, a wyślemy Ci link do resetowania hasła
          </p>
        </div>

        <ResetPasswordForm />

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
