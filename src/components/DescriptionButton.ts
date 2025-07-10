import { YouTubeService } from '../services/youtubeService'

export function setupDescriptionButton(button: HTMLButtonElement | null): void {
  if (!button) {
    console.error('Description button not found')
    return
  }

  button.addEventListener('click', () => {
    YouTubeService.fetchDescription()
  })
}
