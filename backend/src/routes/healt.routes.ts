import { Router } from 'express'
import { HealthController } from '../controllers/healt.controller'
import { jsonContentTypeValidator } from '../middleware/jsonContentTypeValidator'
import { HealthService } from '../services/healt.service'

const router = Router({ caseSensitive: true })

const healthService = new HealthService()
const healthController = new HealthController(healthService)

router.get('/health', (req, res, next) =>
  healthController.getHealth(req, res, next)
)

router.post('/health', jsonContentTypeValidator, (req, res, next) =>
  healthController.postHealthCheck(req, res, next)
)

export default router
