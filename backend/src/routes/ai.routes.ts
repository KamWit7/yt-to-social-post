import { Router } from 'express'
import { AIController } from '../controllers/ai.controller'
import { AIProcessingService } from '../services/ai-processing.service'

const router = Router({ caseSensitive: true })

// Lazy initialization - create service only when needed for .env to loading
let aiService: AIProcessingService | null = null
let aiController: AIController | null = null

function getAIController(): AIController {
  if (!aiService) {
    aiService = new AIProcessingService()
  }
  if (!aiController) {
    aiController = new AIController(aiService)
  }
  return aiController
}

router.post('/process', (req, res, next) =>
  getAIController().processTranscript(req, res, next)
)

export default router
