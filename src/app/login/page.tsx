import { LoginForm } from '@/components/auth/LoginForm'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Logowanie | YT Scribe',
  description:
    'zaloguj się do swojego konta, aby uzyskać dostęp do transkrypcji i podsumowań',
}

export default function LoginPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Witaj ponownie</h1>
          <p className='text-muted-foreground'>
            zaloguj się, aby uzyskać dostęp do swojego konta i kontynuować
            transkrypcję
          </p>
        </div>

        <LoginForm />

        <div className='text-center text-sm space-y-2'>
          <div>
            <span className='text-muted-foreground'>Nie masz konta? </span>
            <Link
              href={ROUTES.REGISTER}
              className='text-primary hover:underline font-medium'>
              Utwórz je tutaj
            </Link>
          </div>

          <div>
            <span className='text-muted-foreground'>Zapomniałeś hasła? </span>
            <Link
              href={ROUTES.RESET_PASSWORD}
              className='text-primary hover:underline font-medium'>
              Resetuj hasło
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
