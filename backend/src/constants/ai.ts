export const AIModels = {
  Gemini25Pro: 'gemini-2.5-pro',
  Gemini25Flash: 'gemini-2.5-flash',
  Gemini25FlashLite: 'gemini-2.5-flash-lite',
} as const

export type AIModelName = (typeof AIModels)[keyof typeof AIModels]

export const DEFAULT_AI_MODEL: AIModelName = AIModels.Gemini25Flash
