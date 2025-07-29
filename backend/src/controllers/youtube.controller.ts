import type { NextFunction, Request, Response } from 'express'
import { IYouTubeTranscriptOrchestrator } from '../interfaces/youtube-orchestrator.interface'
import type { ApiResponse } from '../types/youtube'
import { Utils } from '../utils/format-transcript'

export class YouTubeController {
  constructor(
    private readonly orchestratorService: IYouTubeTranscriptOrchestrator
  ) {}

  async getTranscript(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { url } = req.query

    try {
      Utils.validateUrl(url)

      const data = await this.orchestratorService.getTranscript(url as string)

      const successResponse: ApiResponse<any> = {
        success: true,
        data,
      }

      res.json(successResponse)
    } catch (error) {
      next(error)
    }
  }

  async takeScreenshot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { url } = req.query

    try {
      Utils.validateUrl(url)

      // Note: Screenshot functionality would need to be implemented separately
      // as it was removed from the orchestrator service
      const data = {
        message:
          'Screenshot functionality not available in current implementation',
      }

      const successResponse: ApiResponse<typeof data> = {
        success: true,
        data,
      }

      res.json(successResponse)
    } catch (error) {
      next(error)
    }
  }
}
