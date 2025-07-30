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
      message: 'get health check',
    }
  }

  postHealthCheck(body: unknown): HealthResponse {
    const sanitizedBody =
      typeof body === 'object' && body !== null
        ? JSON.stringify(body)
        : String(body)

    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: `post health check: ${sanitizedBody}`,
    }
  }
}
