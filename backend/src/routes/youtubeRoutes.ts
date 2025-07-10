import { Router } from 'express'
import { YouTubeController } from '../controllers/youtubeController'

const router = Router()

// GET /api/transcript?url=<youtube_url>
router.get('/transcript', YouTubeController.getTranscript)

// GET /api/description?url=<youtube_url>
router.get('/description', YouTubeController.getDescription)

// GET /api/video-info?url=<youtube_url>
router.get('/video-info', YouTubeController.getVideoInfo)

export default router
