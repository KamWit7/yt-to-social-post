// URL validation patterns
export const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+(&.*)?$/,
  /^https?:\/\/youtu\.be\/[\w-]+(\?.*)?$/,
] as const

// Form purpose options
export const PURPOSE_OPTIONS = [
  { value: 'Do nauki', label: 'Do nauki' },
  { value: 'Do pracy', label: 'Do pracy' },
  { value: 'Do tworzenia treści', label: 'Do tworzenia treści' },
  { value: 'Ogólne', label: 'Ogólne' },
  { value: 'Inny', label: 'Inny...' },
] as const

// Default form state
export const DEFAULT_FORM_STATE = {
  url: '',
  purpose: 'Do nauki' as const,
  customPurpose: '',
  isSubmitted: false,
} as const

// Copy timeout duration (in milliseconds)
export const COPY_TIMEOUT = 2000

// Error messages
export const ERROR_MESSAGES = {
  INVALID_URL: 'Proszę wprowadzić prawidłowy link YouTube',
  COPY_FAILED: 'Błąd podczas kopiowania',
  TRANSCRIPT_ERROR: 'Wystąpił błąd podczas pobierania transkrypcji',
  UNEXPECTED_ERROR: 'Wystąpił nieoczekiwany błąd',
} as const

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

// Loading messages
export const LOADING_MESSAGES = {
  ANALYZING: 'Analizuję...',
  GENERATING: 'Generuję...',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  COPIED: 'Skopiowano',
  COPY: 'Kopiuj',
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
