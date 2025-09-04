'use client'

import { LogoutButton } from '@/components/common/LogoutButton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, User } from 'lucide-react'
import Link from 'next/link'
import { USER_MENU_ITEMS } from './constants'
import type { UserMenuProps } from './types'

export function UserMenu({ user }: UserMenuProps) {
  const displayName = user.name || user.email

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
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className='flex items-center gap-2'>
                <Icon className='w-4 h-4' />
                {item.label}
              </Link>
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutButton
            variant='ghost'
            size='sm'
            className='w-full justify-start p-0 h-auto text-sm'
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
