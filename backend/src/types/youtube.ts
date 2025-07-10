export interface TranscriptItem {
  text: string
  start?: number
  duration?: number
}

export interface TranscriptResponse {
  transcript: TranscriptItem[]
}

export interface DescriptionResponse {
  description: string
}

export interface ErrorResponse {
  error: string
  details?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: string
}
