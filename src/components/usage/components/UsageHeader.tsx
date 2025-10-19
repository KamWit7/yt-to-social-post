import { Button } from '@/components/ui/button'
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/utils/constants'
import { Settings } from 'lucide-react'
import Link from 'next/link'

interface UsageHeaderProps {
  isFreeAccount: boolean
}

export function UsageHeader({ isFreeAccount }: UsageHeaderProps) {
  return (
    <CardHeader className='flex items-start justify-between'>
      <div>
        <CardTitle className='pb-2'>Przegląd użycia</CardTitle>
        <CardDescription>
          {isFreeAccount
            ? 'śledź swoje miesięczne generowanie podsumowań'
            : 'śledź swoje generowanie podsumowań'}
        </CardDescription>
      </div>
      <Link href={ROUTES.SETTINGS}>
        <Button variant='outline' size='sm'>
          <Settings className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90' />
          Ustawienia
        </Button>
      </Link>
    </CardHeader>
  )
}
