// URL validation patterns
export const YOUTUBE_URL_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+(&.*)?$/,
  /^https?:\/\/youtu\.be\/[\w-]+(\?.*)?$/,
] as const

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
  RESET_PASSWORD: '/reset-password',
  NEW_RESET_PASSWORD: '/reset-password/new',
  PRIVACY_POLICY: '/privacy-policy',
} as const
