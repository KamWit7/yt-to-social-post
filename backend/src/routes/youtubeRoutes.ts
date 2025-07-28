import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'

const router = Router({ caseSensitive: true })

const youtubeController = new YouTubeController()

router.get('/transcript', (req, res, next) =>
  youtubeController.getTranscript(req, res, next)
)

router.get('/screenshot', (req, res, next) =>
  youtubeController.takeScreenshot(req, res, next)
)

export default router
