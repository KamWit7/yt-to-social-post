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

  private getModel(modelName: AIModelName): GenerativeModel {
    return this.genAI.getGenerativeModel({ model: modelName })
  }

  async processTranscript(
    request: ProcessTranscriptRequest
  ): Promise<AIProcessingResult> {
    const { transcript, purpose, customPrompt, model } = request

    const generativeModel = this.getModel(model ?? DEFAULT_AI_MODEL)

    const tasks: Record<AIProcessingResultKeys, Promise<string | undefined>> = {
      summary: this.generateSummary(transcript, generativeModel),
      topics: this.generateTopics(transcript, generativeModel),
      mindMap: Promise.resolve(undefined),
      socialPost: Promise.resolve(undefined),
      customOutput: Promise.resolve(undefined),
    }

    if (purpose === Dictionary.Purpose.Learning) {
      tasks.mindMap = this.generateMindMap(transcript, generativeModel)
    }

    if (purpose === Dictionary.Purpose.SocialMedia) {
      tasks.socialPost = this.generateSocialPost(transcript, generativeModel)
    }

    if (purpose === Dictionary.Purpose.Custom && customPrompt) {
      tasks.customOutput = this.generateCustomOutput(
        transcript,
        customPrompt,
        generativeModel
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
    model: GenerativeModel
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SUMMARY, {
      transcript,
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateTopics(
    transcript: string,
    model: GenerativeModel
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.TOPICS, {
      transcript,
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateMindMap(
    transcript: string,
    model: GenerativeModel
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.MIND_MAP, {
      transcript,
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonText = response.text().trim()

    try {
      return JSON.parse(jsonText)
    } catch (error) {
      console.error('Error parsing mind map JSON:', error)
      return '{}'
    }
  }

  private async generateSocialPost(
    transcript: string,
    model: GenerativeModel
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.SOCIAL_POST, {
      transcript,
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }

  private async generateCustomOutput(
    transcript: string,
    customPrompt: string,
    model: GenerativeModel
  ): Promise<string> {
    const prompt = PromptLoader.loadPrompt(AVAILABLE_PROMPTS.CUSTOM_OUTPUT, {
      transcript,
      customPrompt,
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  }
}
