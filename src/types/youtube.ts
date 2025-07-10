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

export interface YouTubeApiError {
  error: string
  message: string
}
