import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'

const router = Router()

// GET /api/transcript?url=<youtube_url>
router.get('/transcript', YouTubeController.getTranscript)

// GET /api/screenshot?url=<youtube_url>
router.get('/screenshot', YouTubeController.takeScreenshot)

export default router
