import { Router } from 'express'
import { DictionaryController } from '../controllers/dictionary.controller'
import { validateQuery } from '../middleware/validation.middleware'
import { DictionaryService } from '../services/dictionary.service'
import {
  DictionaryQueryParams,
  TypedRequestQuery,
} from '../types/dictionary.types'
import { DictionaryQuerySchema } from '../validations/dictionary.validations'

const router = Router({ caseSensitive: true })

const dictionaryService = new DictionaryService()
const dictionaryController = new DictionaryController(dictionaryService)

router.get(
  '/dictionary',
  validateQuery(DictionaryQuerySchema),
  (req, res, next) =>
    dictionaryController.getDictionary(
      req as unknown as TypedRequestQuery<DictionaryQueryParams>,
      res,
      next
    )
)

export default router
