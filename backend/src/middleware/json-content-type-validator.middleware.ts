import { NextFunction, Request, Response } from 'express'

export const jsonContentTypeValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const methodsToValidate = ['POST', 'PUT', 'PATCH']

  if (methodsToValidate.includes(req.method)) {
    const contentType = req.header('Content-Type')

    if (!contentType || !contentType.includes('application/json')) {
      res.status(415).json({
        success: false,
        error: {
          message: 'Invalid Content-type - only application/json alowed',
        },
      })

      return
    }
  }

  next()
}
