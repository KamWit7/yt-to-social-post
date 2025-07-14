import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'

const router = Router()

// GET /api/transcript?url=<youtube_url>
router.get('/transcript', YouTubeController.getTranscript)

// GET /api/description?url=<youtube_url>
router.get('/description', YouTubeController.getDescription)

// GET /api/video-info?url=<youtube_url>
router.get('/video-info', YouTubeController.getVideoInfo)

// GET /api/captions?url=<youtube_url>
router.get('/captions', YouTubeController.getCaptionsList)

// GET /api/screenshot?url=<youtube_url>
router.get('/screenshot', YouTubeController.takeScreenshot)

export default router
