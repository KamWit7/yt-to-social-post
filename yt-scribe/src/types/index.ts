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
