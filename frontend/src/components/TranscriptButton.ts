import { YouTubeService } from '../services/youtubeService'

export function setupTranscriptButton(button: HTMLButtonElement | null): void {
  if (!button) {
    console.error('Transcript button not found')
    return
  }

  button.addEventListener('click', () => {
    YouTubeService.fetchTranscript()
  })
}
