import { setupDescriptionButton } from './components/DescriptionButton'
import { setupTranscriptButton } from './components/TranscriptButton'
import './style.css'
import { getElementById } from './utils/domUtils.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>🎬 Pobierz Transkrypcję i Opis z YouTube</h1>
    <input type="text" id="yt-url" placeholder="Wklej link do YouTube..." />

    <button id="transcript-button">📜 Pobierz Transkrypcję</button>
    <button id="description-button">📝 Pobierz Opis</button>
    
    <div class="output">
      <textarea id="output" rows="20" readonly></textarea>
    </div>
  </div>
`

setupTranscriptButton(getElementById<HTMLButtonElement>('transcript-button'))
setupDescriptionButton(getElementById<HTMLButtonElement>('description-button'))
