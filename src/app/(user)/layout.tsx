'use client'

import { GenericHeader } from '@/components/common/GenericHeader/GenericHeader'
import { ROUTES } from '@/utils/constants'
import { Settings, User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

function getPageConfig(pathname: string | null) {
  if (pathname === ROUTES.PROFILE) {
    return {
      title: 'Twój profil',
      description: 'Zarządzaj informacjami o swoim koncie i monitoruj użycie',
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

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const config = getPageConfig(pathname)

  return (
    <div className='space-y-4'>
      <GenericHeader {...config} />

      <div className='flex gap-8 justify-center'>{children}</div>
    </div>
  )
}
