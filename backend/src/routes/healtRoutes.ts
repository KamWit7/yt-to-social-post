import { Router } from 'express'
import { HealthController } from '../controllers/healtControllers'
import { HealthService } from '../services/healtService'

const router = Router()

const healthService = new HealthService()
const healthController = new HealthController(healthService)

router.get('/health', (req, res, next) =>
  healthController.getHealth(req, res, next)
)

export default router
