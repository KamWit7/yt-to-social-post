import { NextFunction, Request, Response } from 'express'
import { AIProcessingService } from '../services/ai-processing.service'

export class AIController {
  constructor(private aiService: AIProcessingService) {}

  async processTranscript(req: Request, res: Response, next: NextFunction) {
    try {
      const { transcript, purpose, customPurpose, options } = req.body

      if (!transcript) {
        res.status(400).json({
          success: false,
          error: 'Transkrypcja jest wymagana',
        })
        return
      }

      if (!purpose) {
        res.status(400).json({
          success: false,
          error: 'Cel przetwarzania jest wymagany',
        })

        return
      }

      const result = await this.aiService.processTranscript({
        transcript,
        purpose,
        customPurpose,
        options,
      })

      res.json({
        success: true,
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }
}
