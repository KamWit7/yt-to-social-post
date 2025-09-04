import { LucideIcon } from 'lucide-react'

export interface MenuItem {
  href: string
  label: string
  icon: LucideIcon
}

export interface UserMenuProps {
  user: {
    name?: string | null
    email?: string | null
  }
}
