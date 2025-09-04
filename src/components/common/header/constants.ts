import { ROUTES } from '@/utils/constants'
import { BarChart3, Home, User } from 'lucide-react'

export const USER_MENU_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
  { href: ROUTES.USAGE, label: 'Usage', icon: BarChart3 },
  { href: ROUTES.PROFILE, label: 'Profile', icon: User },
] as const
