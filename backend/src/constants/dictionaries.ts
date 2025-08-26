const Purpose = {
  Learning: 'learning',
  SocialMedia: 'social_media',
  Custom: 'custom',
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

export type DictionaryItem = {
  code: string
  label: string
}

// Display-ready dictionary values
const PurposeItems: DictionaryItem[] = [
  { code: Purpose.Learning, label: 'Nauka' },
  { code: Purpose.SocialMedia, label: 'Media społecznościowe' },
  { code: Purpose.Custom, label: 'Niestandardowy' },
]

const LanguageItems: DictionaryItem[] = [
  { code: Language.Polish, label: 'Polski' },
  { code: Language.English, label: 'English' },
]

export const DictionaryDisplay = {
  Purpose: PurposeItems,
  Language: LanguageItems,
}
