export type HealthResponse = {
  success: boolean
  timestamp: string
  message: string
}

export class HealthService {
  healthCheck(): HealthResponse {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'YouTube Transcript API is running',
    }
  }
}
