import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'
import { YoutubePuppeteer } from '../services/youtube/YoutubePuppeteer'
import { YouTubeService } from '../services/youtubeService'

const router = Router()

const youtubeService = new YouTubeService(new YoutubePuppeteer())
const youtubeController = new YouTubeController(youtubeService)

router.get('/transcript', (req, res) =>
  youtubeController.getTranscript(req, res)
)

router.get('/screenshot', (req, res) =>
  youtubeController.takeScreenshot(req, res)
)

export default router
