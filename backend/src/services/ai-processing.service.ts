import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { ProcessTranscriptRequest, Purpose } from '../validations'

type PrittifyType<T> = {
  [K in keyof T]: T[K] & {}
}

export type AIProcessingResult = {
  summary?: string | undefined
  topics?: string | undefined
  mindMap?: string | undefined
  socialPost?: string | undefined
  customOutput?: string | undefined
}
type AIProcessingResultKeys = PrittifyType<keyof AIProcessingResult>

export class AIProcessingService {
  private genAI: GoogleGenerativeAI
  private model: GenerativeModel

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })
  }

  async processTranscript(
    request: ProcessTranscriptRequest
  ): Promise<AIProcessingResult> {
    const { transcript, purpose, options } = request

    const result: Record<AIProcessingResultKeys, Promise<string>> = {
      summary: this.generateSummary(transcript),
      topics: this.generateTopics(transcript),
      mindMap: Promise.reject(),
      socialPost: Promise.reject(),
      customOutput: Promise.reject(),
    }

    if (purpose === Purpose.Learning && options?.generateMindMap) {
      result.mindMap = this.generateMindMap(transcript)
    }

    if (purpose === Purpose.SocialMedia && options?.generateSocialPost) {
      result.socialPost = this.generateSocialPost(transcript)
    }

    if (purpose === Purpose.Custom && options?.customPrompt) {
      result.customOutput = this.generateCustomOutput(
        transcript,
        options.customPrompt
      )
    }

    const results = await Promise.allSettled(Object.values(result))

    return results.reduce((acc, curr, index) => {
      const key = Object.keys(result)[index] as AIProcessingResultKeys
      acc[key] = curr.status === 'fulfilled' ? curr.value : undefined
      return acc
    }, {} as AIProcessingResult)
  }

  private async generateSummary(transcript: string): Promise<string> {
    const prompt = `
      Przeanalizuj poniższą transkrypcję i stwórz zwięzłe streszczenie w 2-3 zdaniach.
      Streszczenie powinno zawierać główne punkty i kluczowe informacje.
      
      Transkrypcja:
      ${transcript}
      
      Streszczenie:
    `

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateTopics(transcript: string): Promise<string> {
    const prompt = `
      Przeanalizuj poniższą transkrypcję i wyciągnij kluczowe tematy.
      Przedstaw je w formie listy punktowanej (każdy temat w nowej linii z myślnikiem).
      
      Transkrypcja:
      ${transcript}
      
      Kluczowe tematy:
    `

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateMindMap(transcript: string): Promise<string> {
    const prompt = `
      Przeanalizuj poniższą transkrypcję i stwórz mapę myśli w formacie JSON.
      Mapa myśli powinna mieć strukturę hierarchiczną z głównym tematem i podtematami.
      
      Format JSON:
      {
        "id": "root",
        "type": "input",
        "data": { "label": "Główny temat" },
        "position": { "x": 0, "y": 0 },
        "children": [
          {
            "id": "child1",
            "type": "default",
            "data": { "label": "Podtemat 1" },
            "position": { "x": -200, "y": 100 }
          }
        ]
      }
      
      Transkrypcja:
      ${transcript}
      
      Mapa myśli (JSON):
    `

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text().trim()

    try {
      return JSON.parse(jsonText)
    } catch (error) {
      console.error('Error parsing mind map JSON:', error)
      return '{}'
    }
  }

  private async generateSocialPost(transcript: string): Promise<string> {
    const prompt = `
      Przeanalizuj poniższą transkrypcję i stwórz angażujący post na social media.
      Post powinien być krótki (maksymalnie 280 znaków), interesujący i zachęcać do interakcji.
      Dodaj odpowiednie hashtagi na końcu.
      
      Transkrypcja:
      ${transcript}
      
      Post na social media:
    `

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateCustomOutput(
    transcript: string,
    customPrompt: string
  ): Promise<string> {
    const prompt = `
      Przeanalizuj poniższą transkrypcję i odpowiedz na pytanie/polecenie użytkownika.
      
      Transkrypcja:
      ${transcript}
      
      Polecenie użytkownika:
      ${customPrompt}
      
      Odpowiedź:
    `

    const result = await this.model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }
}
