import { TemperatureMode } from '@/utils/modelTemperature'

export const AIModels = {
  Gemini25Pro: 'gemini-2.5-pro',
  Gemini25Flash: 'gemini-2.5-flash',
  Gemini25FlashLite: 'gemini-2.5-flash-lite',
} as const

type AIModelName = (typeof AIModels)[keyof typeof AIModels]

export const DEFAULT_AI_MODEL: AIModelName = AIModels.Gemini25Flash

export const Purpose = {
  SocialMedia: 'social_media',
  Custom: 'custom',
  Summary: 'summary',
  Topics: 'topics',
} as const

const Language = {
  Polish: 'pl',
  English: 'en',
} as const

export type PurposeValue = (typeof Purpose)[keyof typeof Purpose]
export type LanguageValue = (typeof Language)[keyof typeof Language]

export const Dictionary = {
  Purpose,
  Language,
}

type DictionaryItem = {
  code: string
  label: string
}

// Display-ready dictionary values
const PurposeItems: DictionaryItem[] = [
  { code: Purpose.SocialMedia, label: 'Media społecznościowe' },
  { code: Purpose.Custom, label: 'Niestandardowy' },
]

const LanguageItems: DictionaryItem[] = [
  { code: Language.Polish, label: 'Polski' },
  { code: Language.English, label: 'English' },
]

const TemperatureModeItems: DictionaryItem[] = [
  { code: TemperatureMode.PRECISE, label: 'Precyzyjny' },
  { code: TemperatureMode.BALANCED, label: 'Zrównoważony' },
  { code: TemperatureMode.CREATIVE, label: 'Kreatywny' },
]

export const DictionaryDisplay = {
  Purpose: PurposeItems,
  Language: LanguageItems,
  TemperatureMode: TemperatureModeItems,
}

export const DEFAULT_LANGUAGE = Dictionary.Language.Polish
export const DEFAULT_TEMPERATURE_MODE = TemperatureMode.BALANCED
