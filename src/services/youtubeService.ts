import { getOutput, getUrlInput } from '../utils/domUtils'
import { downloadDescription, downloadTranscript } from '../utils/downloadUtils'

import { ApiService } from './apiService'

export class YouTubeService {
  static async fetchTranscript(): Promise<void> {
    const urlInput = getUrlInput()
    const output = getOutput()

    const url = urlInput.value
    if (!url) {
      output.value = '❌ Wprowadź link do YouTube'
      return
    }

    output.value = 'Ładowanie transkrypcji...'

    try {
      const data = await ApiService.fetchTranscript(url)
      const text = data.transcript.map((t) => t.text).join('\n')

      output.value = text
      downloadTranscript(text)
    } catch (error) {
      console.error('Błąd pobierania transkrypcji:', error)
      output.value = '❌ Błąd pobierania transkrypcji'
    }
  }

  static async fetchDescription(): Promise<void> {
    const urlInput = getUrlInput()
    const output = getOutput()

    const url = urlInput.value
    if (!url) {
      output.value = '❌ Wprowadź link do YouTube'
      return
    }

    output.value = 'Ładowanie opisu...'

    try {
      const data = await ApiService.fetchDescription(url)

      output.value = data.description
      downloadDescription(data.description)
    } catch (error) {
      console.error('Błąd pobierania opisu:', error)
      output.value = '❌ Błąd pobierania opisu'
    }
  }
}
