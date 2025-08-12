import type { NextFunction, Request, Response } from 'express'
import {
  GetTranscriptReturnType,
  IYouTubeTranscriptOrchestrator,
} from '../interfaces/youtube-orchestrator.interface'
import { TranscriptParser } from '../parsers/transcript-parser'
import { ApiResponse } from '../types/api.types'

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
      TranscriptParser.validateUrl(url)

      const data: ApiResponse<GetTranscriptReturnType> =
        await this.orchestratorService.getTranscript(url as string)

      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
