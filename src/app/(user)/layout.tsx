import { GenericHeader } from '@/components/common/GenericHeader/GenericHeader'
import { HEADERS_PATH_KEY } from '@/middleware'
import { ROUTES } from '@/utils/constants'
import { BarChart3, Settings, Sparkles, User } from 'lucide-react'
import { headers } from 'next/headers'
import React from 'react'

function getPageConfig(pathname: string | null) {
  if (pathname === ROUTES.USAGE) {
    return {
      title: 'Panel użycia',
      description:
        'Monitoruj użycie generowania podsumowań i śledz swoje miesięczne limity',
      icon: BarChart3,
      features: [
        { icon: Sparkles, text: 'Śledzenie w czasie rzeczywistym' },
        { icon: BarChart3, text: 'Analityka wizualna' },
      ],
    }
  }

  if (pathname === ROUTES.PROFILE) {
    return {
      title: 'Twój profil',
      description: 'Zarządzaj informacjami o swoim koncie',
      icon: User,
      features: [],
    }
  }

  if (pathname === ROUTES.SETTINGS) {
    return {
      title: 'Ustawienia',
      description: 'Zarządzaj ustawieniami konta',
      icon: Settings,
      features: [],
    }
  }

  return {
    title: 'Panel główny',
    description: 'Zarządzaj swoim kontem i użyciem',
    icon: User,
    features: [],
  }
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  const pathname = headerList.get(HEADERS_PATH_KEY)
  const config = getPageConfig(pathname)

  const isProfileOrUsage = (
    [ROUTES.PROFILE, ROUTES.USAGE] as Array<string>
  ).includes(pathname ?? '')

  return (
    <div className='space-y-4'>
      <GenericHeader {...config} />

      <div className={isProfileOrUsage ? 'container mx-auto max-w-md' : ''}>
        {children}
      </div>
    </div>
  )
}
