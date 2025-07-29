import { NextFunction, Request, Response } from 'express'
import { HealthResponse, HealthService } from '../services/healt.service'
import { ApiResponse } from '../types/youtube.types'

export class HealthController {
  constructor(private healthService: HealthService) {}

  getHealth(_req: Request, res: Response, next: NextFunction) {
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

  postHealthCheck(req: Request, res: Response, next: NextFunction) {
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
