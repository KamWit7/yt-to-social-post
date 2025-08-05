export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface ProcessTranscriptResponse {
  success: boolean
  summary?: string
  topics?: string
  mindMap?: string
  socialPost?: string
  customOutput?: string
  error?: string
}
