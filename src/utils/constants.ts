// URL validation patterns
export const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+(&.*)?$/,
  /^https?:\/\/youtu\.be\/[\w-]+(\?.*)?$/,
] as const

// Usage limit messages
export const USAGE_LIMIT_MESSAGES = {
  LIMIT_EXCEEDED: 'Limit darmowego planu wyczerpany',
  USAGE_CHECK_ERROR: 'Nie udało się sprawdzić limitu użycia',
  FREE_PLAN_INFO:
    'Wykorzystałeś już wszystkie dostępne podsumowania w ramach darmowego planu',
} as const

// Usage gate text
export const USAGE_GATE_TEXT = {
  TITLE: 'Limit darmowego planu wyczerpany',
  DESCRIPTION:
    'Wykorzystałeś już wszystkie {limit} dostępnych podsumowań w ramach darmowego planu',
  USAGE_LABEL: 'Wykorzystanie:',
  USAGE_COMPLETE: '100% wykorzystane',
  VIEW_DETAILS_BUTTON: 'Zobacz szczegóły użycia',
} as const

// Usage levels
export const UsageLevel = {
  SAFE: 'safe',
  WARNING: 'warning',
  DANGER: 'danger',
  BYOK: 'byok',
} as const

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
} as const

