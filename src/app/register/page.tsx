import { RegisterForm } from '@/components/auth/RegisterForm'
import { ROUTES } from '@/utils/constants'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Utwórz Konto | YT Scribe',
  description:
    'Utwórz nowe konto, aby rozpocząć transkrypcję i podsumowywanie filmów YouTube',
}

export default function RegisterPage() {
  return (
    <div className='container mx-auto max-w-md py-8'>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>Utwórz konto</h1>
          <p className='text-muted-foreground'>
            Dołącz do YT Scribe, aby rozpocząć transkrypcję filmów YouTube z AI
          </p>
        </div>

        <RegisterForm />

        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>Masz już konto? </span>
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
