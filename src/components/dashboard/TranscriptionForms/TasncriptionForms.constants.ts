export const DEFAULT_PURPOSE = 'custom'

export const FORM_FIELD_NAMES = {
  URL: 'url',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  LANGUAGE: 'language',
  CUSTOM_PROMPT: 'customPrompt',
  MODEL: 'model',
  TEMPERATURE_MODE: 'temperatureMode',
} as const

export const LOADING_MESSAGES = {
  ANALYZING: 'Analizuję...',
  GENERATING: 'Generuję...',
  FETCHING_TRANSCRIPT: 'Generuję transkrypcję...',
} as const
