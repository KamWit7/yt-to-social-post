import type { NextFunction, Request, Response } from 'express'
import { IYouTubeTranscriptOrchestrator } from '../interfaces/youtube-orchestrator.interface'
import { ApiResponse } from '../types/youtube.types'
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

      if (!data.success) {
        throw new Error(data.error)
      }

      const successResponse: ApiResponse<any> = {
        success: true,
        data,
      }

      res.json(successResponse)
    } catch (error) {
      next(error)
    }
  }
}
