import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai'
import { AIModelName, DEFAULT_AI_MODEL } from '../constants/ai'
import { Dictionary } from '../constants/dictionaries'
import { AVAILABLE_PROMPTS, PromptLoader } from '../prompts'
import { ProcessTranscriptRequest } from '../validations'

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

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  private async generateWithRetry(
    model: GenerativeModel,
    prompt: string,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text().trim()
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries
        const isRetriableError = error.status === 500 || error.status === 503

        if (!isRetriableError || isLastAttempt) {
          throw error
        }

        // Exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1)
        console.warn(
          `AI generation attempt ${attempt} failed, retrying in ${delay}ms:`,
          error.message
        )

        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    throw new Error('Max retries exceeded')
  }

  private getModel(modelName: AIModelName): GenerativeModel {
    return this.genAI.getGenerativeModel({ model: modelName })
  }

  async processTranscript(
    request: ProcessTranscriptRequest
  ): Promise<AIProcessingResult> {
    const { transcript, purpose, language, customPrompt, model } = request

    const generativeModel = this.getModel(model ?? DEFAULT_AI_MODEL)

    const tasks: Record<AIProcessingResultKeys, Promise<string | undefined>> = {
      summary: this.generateSummary(transcript, generativeModel, language),
      topics: this.generateTopics(transcript, generativeModel, language),
      mindMap: Promise.resolve(undefined),
      socialPost: Promise.resolve(undefined),
      customOutput: Promise.resolve(undefined),
    }

    if (purpose === Dictionary.Purpose.Learning) {
      tasks.mindMap = this.generateMindMap(
        transcript,
        generativeModel,
        language
      )
    }

    if (purpose === Dictionary.Purpose.SocialMedia) {
      tasks.socialPost = this.generateSocialPost(
        transcript,
        generativeModel,
        language
      )
    }

    if (purpose === Dictionary.Purpose.Custom && customPrompt) {
      tasks.customOutput = this.generateCustomOutput(
        transcript,
        customPrompt,
        generativeModel,
        language
      )
    }

    const response = {} as AIProcessingResult

    for (const [key, task] of Object.entries(tasks)) {
      try {
        const result = await task
        response[key as AIProcessingResultKeys] = result
      } catch (error) {
        console.error(`Error processing ${key}:`, error)
        response[key as AIProcessingResultKeys] = undefined
      }
    }

    return response
  }

  private async generateSummary(
    transcript: string,
    model: GenerativeModel,
    language: string
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SUMMARY, {
      transcript,
      language,
    })

    return this.generateWithRetry(model, prompt)
  }

  private async generateTopics(
    transcript: string,
    model: GenerativeModel,
    language: string
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.TOPICS, {
      transcript,
      language,
    })

    return this.generateWithRetry(model, prompt)
  }

  private async generateMindMap(
    transcript: string,
    model: GenerativeModel,
    language: string,
    maxRetries: number = 3
  ): Promise<any> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.MIND_MAP, {
      transcript,
      language,
    })

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const jsonText = await this.generateWithRetry(model, prompt)

        let jsonTextWithoutTags = jsonText

        if (jsonText.startsWith('```json\n')) {
          jsonTextWithoutTags = jsonText
            .replace(/```json\n/, '')
            .replace(/\n```/, '')
        }

        const parsedJson = JSON.parse(jsonTextWithoutTags)

        return parsedJson
      } catch (error) {
        const isLastAttempt = attempt === maxRetries

        if (isLastAttempt) {
          console.error(
            `Error generating mind map after ${maxRetries} attempts:`,
            error
          )
          return {}
        }

        console.warn(
          `Mind map generation attempt ${attempt} failed, retrying:`,
          error instanceof Error ? error.message : String(error)
        )

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return {}
  }

  private async generateSocialPost(
    transcript: string,
    model: GenerativeModel,
    language: string
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SOCIAL_POST, {
      transcript,
      language,
    })

    return this.generateWithRetry(model, prompt)
  }

  private async generateCustomOutput(
    transcript: string,
    customPrompt: string,
    model: GenerativeModel,
    language: string
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.CUSTOM_OUTPUT, {
      transcript,
      customPrompt,
      language,
    })

    return this.generateWithRetry(model, prompt)
  }
}
