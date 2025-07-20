import type { NextFunction, Request, Response } from 'express'
import { Utils } from '../services/youtube/Utils'
import { YouTubeService } from '../services/youtubeService'
import type { ApiResponse } from '../types/youtube'

export class YouTubeController {
  constructor(private youtubeService: YouTubeService) {}

  async getTranscript(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { url } = req.query

    try {
      Utils.validateUrl(url)

      const data = await this.youtubeService.getTranscript(url as string)

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

      const data = await this.youtubeService.takeScreenshot(url as string)

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
