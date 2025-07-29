import { Router } from 'express'
import { YouTubeController } from '../controllers/youtube.controller'
import { YouTubeTranscriptOrchestratorService } from '../services/youtube-transcript-orchestrator.service'
import { YouTubeService } from '../services/youtube.service'

const router = Router({ caseSensitive: true })

const youtubeService = new YouTubeService()
const orchestratorService = new YouTubeTranscriptOrchestratorService(
  youtubeService
)
const youtubeController = new YouTubeController(orchestratorService)

router.get('/transcript', (req, res, next) =>
  youtubeController.getTranscript(req, res, next)
)

export default router
