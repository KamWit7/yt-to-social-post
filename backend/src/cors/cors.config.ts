import cors from 'cors'
import { NextFunction, Request, Response } from 'express'

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
]

export const corsConfig = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin

  const credentials = origin ? ALLOWED_ORIGINS.includes(origin) : true

  const corsOptions = {
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!requestOrigin || ALLOWED_ORIGINS.includes(requestOrigin)) {
        return callback(null, true)
      }

      callback(null, false)
    },
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials,
  }

  cors(corsOptions)(req, res, next)
}
