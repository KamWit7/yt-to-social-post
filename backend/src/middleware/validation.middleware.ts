import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

interface ValidationError {
  field: string
  message: string
  code: string
}

interface ValidationResponse {
  success: false
  error: string
  details: z.core.$ZodIssue[]
}

const handleValidationError = (
  error: ZodError,
  errorType: string
): ValidationResponse => {
  return {
    success: false,
    error: `Błąd walidacji: ${errorType}`,
    details: error.issues,
  }
}

export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = handleValidationError(error, 'body')
        res.status(400).json(errorResponse)
        return
      }
      next(error)
    }
  }
}

export const validateQuery = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query)
      req.query = validatedData as any
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = handleValidationError(error, 'query')
        res.status(400).json(errorResponse)
        return
      }
      next(error)
    }
  }
}

export const validateParams = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.params)
      req.params = validatedData as any
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = handleValidationError(error, 'parametrów')
        res.status(400).json(errorResponse)
        return
      }
      next(error)
    }
  }
}

export const validateRequest = <TBody, TQuery, TParams>(
  bodySchema?: z.ZodSchema<TBody>,
  querySchema?: z.ZodSchema<TQuery>,
  paramsSchema?: z.ZodSchema<TParams>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (bodySchema) {
        req.body = bodySchema.parse(req.body)
      }
      if (querySchema) {
        req.query = querySchema.parse(req.query) as any
      }
      if (paramsSchema) {
        req.params = paramsSchema.parse(req.params) as any
      }
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorResponse = handleValidationError(error, '')
        res.status(400).json(errorResponse)
        return
      }
      next(error)
    }
  }
}
