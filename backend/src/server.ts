import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import requestIp from 'request-ip'
import { corsConfig } from './cors/cors.config'
import {
  errorHandler,
  notFoundHandler,
} from './middleware/error-handler.middleware'
import { limiter } from './middleware/limiter.middleware'
import aiRoutes from './routes/ai.routes'
import dictionaryRoutes from './routes/dictionary.routes'
import healthRoutes from './routes/health.routes'
import youtubeRoutes from './routes/youtube.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.set('trust proxy', 1)

app.set('case sensitive routing', true)
app.set('strict routing', false)

app.use(requestIp.mw())

app.use(helmet())

app.use(corsConfig)

app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api', youtubeRoutes)
app.use('/api', healthRoutes)
app.use('/api', dictionaryRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFoundHandler)

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📡 API available at http://localhost:${PORT}/api`)
    console.log(`🏥 Health check at http://localhost:${PORT}/api/health`)
  })
}

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

export { app }
