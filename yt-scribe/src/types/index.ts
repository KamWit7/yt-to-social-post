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
  summary?: string
  topics?: string
  mindMap?: Record<string, unknown>
  socialPost?: string
  customOutput?: string
  error?: string
}
