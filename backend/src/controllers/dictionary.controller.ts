import { NextFunction, Response } from 'express'
import {
  DictionaryCode,
  DictionaryService,
} from '../services/dictionary.service'
import {
  DictionaryApiResponse,
  DictionaryQueryParams,
  TypedRequestQuery,
} from '../types/dictionary.types'

export class DictionaryController {
  constructor(private dictionaryService: DictionaryService) {}

  getDictionary(
    req: TypedRequestQuery<DictionaryQueryParams>,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const codeParam = String(req.query.code)

      const codeMap: Record<string, DictionaryCode> = {
        purpose: 'Purpose',
        language: 'Language',
      }

      const mappedCode = codeMap[codeParam]

      if (!mappedCode) {
        const response: DictionaryApiResponse = {
          success: false,
          error: 'Nieznany kod słownika',
          details: `Nieobsługiwany code=${codeParam}`,
        }
        res.status(400).json(response)
        return
      }
      const data = this.dictionaryService.getByCode(mappedCode)
      const response: DictionaryApiResponse = { success: true, data }
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}
