export const PURPOSE_OPTIONS = [
  { value: 'Do nauki', label: 'Do nauki' },
  { value: 'Do pracy', label: 'Do pracy' },
  { value: 'Do tworzenia treści', label: 'Do tworzenia treści' },
  { value: 'Ogólne', label: 'Ogólne' },
  { value: 'Inny', label: 'Inny...' },
]

export const DEFAULT_PURPOSE = 'Do nauki'

export const FORM_FIELD_NAMES = {
  URL: 'url',
  PURPOSE: 'purpose',
  CUSTOM_PURPOSE: 'customPurpose',
} as const

export const DEFAULT_VALUES = {
  url: '',
  purpose: DEFAULT_PURPOSE,
  customPurpose: '',
} as const

export const LOADING_MESSAGES = {
  ANALYZING: 'Analizuję...',
  GENERATING: 'Generuję...',
} as const

export const SUCCESS_MESSAGES = {
  COPIED: 'Skopiowano',
  COPY: 'Kopiuj',
} as const
