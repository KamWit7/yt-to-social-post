import { GenericHeader } from '@/components/common/GenericHeader/GenericHeader'
import { HEADERS_PATH_KEY } from '@/middleware'
import { ROUTES } from '@/utils/constants'
import { BarChart3, Sparkles, User } from 'lucide-react'
import { headers } from 'next/headers'
import React from 'react'

function getPageConfig(pathname: string | null) {
  if (pathname === ROUTES.USAGE) {
    return {
      title: 'Usage Dashboard',
      description:
        'Monitor your summary generation usage and track your monthly limits',
      icon: BarChart3,
      features: [
        { icon: Sparkles, text: 'Real-time tracking' },
        { icon: BarChart3, text: 'Visual analytics' },
      ],
    }
  }

  if (pathname === ROUTES.PROFILE) {
    return {
      title: 'Your Profile',
      description: 'Manage your account settings and information',
      icon: User,
      features: [],
    }
  }

  return {
    title: 'Dashboard',
    description: 'Manage your account and usage',
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

  return (
    <div className='space-y-8'>
      <GenericHeader {...config} />

      <div className='container mx-auto max-w-md'>{children}</div>
    </div>
  )
}
