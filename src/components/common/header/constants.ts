import { ROUTES } from '@/utils/constants'
import { BarChart3, Home, Settings, User } from 'lucide-react'

export const USER_MENU_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Panel główny', icon: Home },
  { href: ROUTES.USAGE, label: 'Użycie', icon: BarChart3 },
  { href: ROUTES.PROFILE, label: 'Profil', icon: User },
  { href: ROUTES.SETTINGS, label: 'Ustawienia', icon: Settings },
] as const

export const USAGE_COUNTER_CONSTANTS = {
  TOOLTIP_TITLE: 'Limit zapytań',
  TOOLTIP_DESCRIPTION: 'Kliknij aby dowiedzieć się więcej o swoich limitach.',
} as const
