import { NextFunction, Response } from 'express'
import {
  AIProcessingResult,
  AIProcessingService,
} from '../services/ai-processing.service'
import { TypedRequestBody } from '../types/ai.types'
import { ApiResponse } from '../types/api.types'
import { ProcessTranscriptRequest } from '../validations/ai.validations'

type ProcessTranscriptResponse = AIProcessingResult & {
  success: boolean
  error?: string
}

type ProcessTranscriptRequestBody = TypedRequestBody<ProcessTranscriptRequest>

export class AIController {
  constructor(private aiService: AIProcessingService) {}

  async processTranscript(
    req: ProcessTranscriptRequestBody,
    res: Response<ApiResponse<AIProcessingResult>>,
    next: NextFunction
  ) {
    try {
      const { transcript, purpose, options } = req.body

      const result = await this.aiService.processTranscript({
        transcript,
        purpose,
        options,
      })

      res.json({ success: true, data: result })
    } catch (error) {
      next(error)
    }
  }
}
