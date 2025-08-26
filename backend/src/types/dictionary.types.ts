/**
 * Types for Dictionary endpoint (request/response)
 */

import { DictionaryItem } from '../constants/dictionaries'
import { ApiResponse } from './api.types'

/**
 * Supported dictionary codes for the public API layer (query param `code`)
 * Extend this union as new dictionaries are exposed.
 */
export type DictionaryApiCode = 'purpose' | 'language'

/**
 * Typed query params for GET /api/dictionary
 */
export interface DictionaryQueryParams {
  code: DictionaryApiCode
}

/**
 * Convenience generic to type Express requests with a specific query shape
 */
export interface TypedRequestQuery<T> extends Express.Request {
  query: T
}

/**
 * Data payload returned by the dictionary endpoint
 */
export type DictionaryData = DictionaryItem[]

/**
 * API response wrapper for dictionary data
 */
export type DictionaryApiResponse = ApiResponse<DictionaryData>
