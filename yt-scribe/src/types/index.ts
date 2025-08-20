export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string
}

export interface TranscriptSegment {
  text: string
  duration: number
  offset: number
}

export interface ApiError {
  message: string
}

export const AIModels = {
  Gemini25Pro: 'gemini-2.5-pro',
  Gemini25Flash: 'gemini-2.5-flash',
  Gemini25FlashLite: 'gemini-2.5-flash-lite',
} as const

export type AIModelName = (typeof AIModels)[keyof typeof AIModels]

export const DEFAULT_AI_MODEL: AIModelName = AIModels.Gemini25Pro

export interface AIProcessingRequest {
  transcript: string
  purpose: string
  customPurpose?: string
  customPrompt?: string
  model?: AIModelName
}

export interface AIProcessingResponse {
  summary?: string
  topics?: string
  mindMap?: Record<string, unknown>
  socialPost?: string
  customOutput?: string
  error?: string
}
