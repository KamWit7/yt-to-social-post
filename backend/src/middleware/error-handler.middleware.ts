import type { NextFunction, Request, Response } from 'express'
import type { YouTubeError } from '../utils/errors'
import { Logger } from '../utils/logger'

export type MiddlewareError = {
  success: false
  error: string
  name: string
}

export function errorHandler(
  error: YouTubeError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  const name = error.name || 'Unknown Error'

  Logger.error(`Error ${statusCode}: ${message}`)
  Logger.error(`Error Stack: ${error.stack}`)

  const responseError: MiddlewareError = {
    success: false,
    error: message,
    name,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  }

  res.status(statusCode).json(responseError)
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  })
}
