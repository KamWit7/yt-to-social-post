'use client'

import { useLogout } from '@/components/common/LogoutButton/useLogout'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/utils/constants'
import { ChevronDown, Home, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'

const USER_MENU_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Panel główny', icon: Home },
  { href: ROUTES.PROFILE, label: 'Profil', icon: User },
  { href: ROUTES.SETTINGS, label: 'Ustawienia', icon: Settings },
] as const

type UserMenuProps = {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const displayName = user.name || user.email
  const { isLoading, handleLogout } = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <User className='w-4 h-4' />
          <span>{displayName}</span>
          <ChevronDown className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-48'>
        {USER_MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className='cursor-pointer'>
              <Link href={item.href} className='flex items-center gap-2'>
                <Icon className='w-4 h-4' />
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className='cursor-pointer'>
          <span className='flex items-center gap-2'>
            <LogOut className='w-4 h-4' />
            {isLoading ? 'Wylogowywanie...' : 'Wyloguj się'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
