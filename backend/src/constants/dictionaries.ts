const Purpose = {
  Learning: 'learning',
  SocialMedia: 'social_media',
  Custom: 'custom',
} as const

export type PurposeValue = (typeof Purpose)[keyof typeof Purpose]

export const Dictionary = {
  Purpose,
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

export const DictionaryDisplay = {
  Purpose: PurposeItems,
}
