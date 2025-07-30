import { Router } from 'express'
import { HealthController } from '../controllers/health.controller'
import { jsonContentTypeValidatorMiddleware } from '../middleware/json-content-type-validator.middleware'
import { HealthService } from '../services/health.service'

const router = Router({ caseSensitive: true })

const healthService = new HealthService()
const healthController = new HealthController(healthService)

router.get('/health', (req, res, next) =>
  healthController.getHealth(req, res, next)
)

router.post('/health', jsonContentTypeValidatorMiddleware, (req, res, next) =>
  healthController.postHealthCheck(req, res, next)
)

export default router
