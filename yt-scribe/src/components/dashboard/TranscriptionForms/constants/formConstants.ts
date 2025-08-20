export const DEFAULT_PURPOSE = 'custom'

export const FORM_FIELD_NAMES = {
  URL: 'url',
  TRANSCRIPT: 'transcript',
  PURPOSE: 'purpose',
  CUSTOM_PURPOSE: 'customPurpose',
  GENERATE_MIND_MAP: 'options.generateMindMap',
  GENERATE_SOCIAL_POST: 'options.generateSocialPost',
  CUSTOM_PROMPT: 'options.customPrompt',
  GENERATE_SUMMARY: 'options.generateSummary',
  GENERATE_KEY_POINTS: 'options.generateKeyPoints',
  GENERATE_QUESTIONS: 'options.generateQuestions',
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
    generateSummary: false,
    generateKeyPoints: false,
    generateQuestions: false,
  },
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
