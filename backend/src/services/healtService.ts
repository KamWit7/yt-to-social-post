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
      message: 'get healt check',
    }
  }

  postHealthCheck(body: any): HealthResponse {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: `post health check: ${JSON.stringify(body)}`,
    }
  }
}
