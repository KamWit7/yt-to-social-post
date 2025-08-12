export const DEFAULT_PURPOSE = 'learning'

export const FORM_FIELD_NAMES = {
  URL: 'url',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  CUSTOM_PURPOSE: 'customPurpose',
  GENERATE_MIND_MAP: 'options.generateMindMap',
  GENERATE_SOCIAL_POST: 'options.generateSocialPost',
  CUSTOM_PROMPT: 'options.customPrompt',
} as const

export const DEFAULT_VALUES = {
  url: '',
  transcript: '',
  purpose: DEFAULT_PURPOSE,
  customPurpose: '',
  options: {
    generateMindMap: false,
    generateSocialPost: false,
    customPrompt: '',
  },
} as const

export const LOADING_MESSAGES = {
  ANALYZING: 'Analizuję...',
  GENERATING: 'Generuję...',
} as const

export const SUCCESS_MESSAGES = {
  COPIED: 'Skopiowano',
  COPY: 'Kopiuj',
} as const
