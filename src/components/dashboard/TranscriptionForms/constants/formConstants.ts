import { DEFAULT_AI_MODEL, DEFAULT_LANGUAGE } from '@/types'

export const DEFAULT_PURPOSE = 'custom'

export const FORM_FIELD_NAMES = {
  URL: 'url',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  LANGUAGE: 'language',
  CUSTOM_PROMPT: 'customPrompt',
  MODEL: 'model',
} as const

export const DEFAULT_VALUES = {
  url: '',
  transcript: '',
  purpose: DEFAULT_PURPOSE,
  language: DEFAULT_LANGUAGE,
  customPrompt: '',
  model: DEFAULT_AI_MODEL,
} as const

export const LOADING_MESSAGES = {
  ANALYZING: 'Analizuję...',
  GENERATING: 'Generuję...',
  FETCHING_TRANSCRIPT: 'Generuję transkrypcję...',
} as const

export const SUCCESS_MESSAGES = {
  COPIED: 'Skopiowano',
  COPY: 'Kopiuj',
} as const
