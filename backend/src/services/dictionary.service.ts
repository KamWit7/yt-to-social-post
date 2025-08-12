import { DictionaryDisplay } from '../constants/dictionaries'
import { DictionaryData } from '../types/dictionary.types'

export type DictionaryCode = keyof typeof DictionaryDisplay

export class DictionaryService {
  getByCode(code: DictionaryCode): DictionaryData {
    return DictionaryDisplay[code]
  }
}
