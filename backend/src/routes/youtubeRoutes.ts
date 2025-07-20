import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'
import { YoutubePuppeteer } from '../puppetieer/youtube/YoutubePuppeteer'
import { YouTubeService } from '../services/youtubeService'

const router = Router()

const youtubePuppeteer = new YoutubePuppeteer()
const youtubeService = new YouTubeService(youtubePuppeteer)
const youtubeController = new YouTubeController(youtubeService)

router.get('/transcript', (req, res, next) =>
  youtubeController.getTranscript(req, res, next)
)

router.get('/screenshot', (req, res, next) =>
  youtubeController.takeScreenshot(req, res, next)
)

export default router
