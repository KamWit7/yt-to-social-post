import { NextFunction, Request, Response } from 'express'
import { HealthResponse, HealthService } from '../services/health.service'
import { ApiResponse } from '../types/api.types'

export class HealthController {
  constructor(private healthService: HealthService) {}

  getHealth(_req: Request, res: Response, next: NextFunction): void {
    try {
      const health = this.healthService.healthCheck()

      const successResponse: ApiResponse<HealthResponse> = {
        success: true,
        data: health,
      }

      res.json(successResponse)
    } catch (error) {
      next(error)
    }
  }

  postHealthCheck(req: Request, res: Response, next: NextFunction): void {
    try {
      const health = this.healthService.postHealthCheck(req.body)

      const successResponse: ApiResponse<HealthResponse> = {
        success: true,
        data: health,
      }

      res.json(successResponse)
    } catch (error) {
      next(error)
    }
  }
}
