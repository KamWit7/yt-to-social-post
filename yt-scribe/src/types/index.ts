export interface TranscriptSegment {
  text: string
  duration: number
  offset: number
}

export interface TranscriptResponse {
  success: boolean
  transcript?: string
  title?: string
  description?: string
  error?: string
}

export interface ApiError {
  message: string
}

export interface AIProcessingRequest {
  transcript: string
  purpose: string
  customPurpose?: string
  options?: {
    generateMindMap?: boolean
    generateSocialPost?: boolean
    customPrompt?: string
  }
}

export interface AIProcessingResponse {
  success: boolean
  summary?: string
  topics?: string
  mindMap?: Record<string, unknown>
  socialPost?: string
  customOutput?: string
  error?: string
}
