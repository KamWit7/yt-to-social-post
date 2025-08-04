import { GoogleGenerativeAI } from '@google/generative-ai'

interface AIProcessingRequest {
  transcript: string
  purpose: string
  customPurpose?: string
  options?: {
    generateMindMap?: boolean
    generateSocialPost?: boolean
    customPrompt?: string
  }
}

interface AIProcessingResult {
  summary: string | undefined
  topics: string | undefined
  mindMap: string | undefined
  socialPost: string | undefined
  customOutput: string | undefined
}

export class AIProcessingService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey as string)
    
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    })
  }

  async processTranscript(
    request: AIProcessingRequest
  ): Promise<AIProcessingResult> {
    const { transcript, purpose, customPurpose, options } = request

    // Zawsze generuj streszczenie i tematy
    const tasks = [
      this.generateSummary(transcript),
      this.generateTopics(transcript),
    ]

    // Dodaj opcjonalne zadania na podstawie celu i opcji
    if (purpose === 'Do nauki' && options?.generateMindMap) {
      tasks.push(this.generateMindMap(transcript))
    }

    if (purpose === 'Do tworzenia treści' && options?.generateSocialPost) {
      tasks.push(this.generateSocialPost(transcript))
    }

    if (purpose === 'Ogólne' && options?.customPrompt) {
      tasks.push(this.generateCustomOutput(transcript, options.customPrompt))
    }

    // Wykonaj wszystkie zadania równolegle
    const results = await Promise.all(tasks)

    return {
      summary: results[0],
      topics: results[1],
      mindMap: results[2],
      socialPost: results[3],
      customOutput: results[4],
    }
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

  private async generateMindMap(transcript: string): Promise<any> {
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
      return null
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
