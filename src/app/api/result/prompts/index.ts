import {
  Dictionary,
  PurposeValue,
} from '@/components/dashboard/TranscriptionForms/forms/Form.constants'
import { getPrompt as getCustomOutputPrompt } from './custom-output.prompt'
import { getPrompt as getSocialPostPrompt } from './social-post.prompt'
import { getPrompt as getSummaryPrompt } from './summary.prompt'
import { getPrompt as getTopicsPrompt } from './topics.prompt'

export class PromptLoader {
  static loadPrompt(
    promptName: PurposeValue,
    variables: Record<
      'transcript' | 'language' | 'customPrompt',
      string | undefined
    > = {
      transcript: '',
      language: '',
      customPrompt: '',
    }
  ): string {
    try {
      let prompt: string

      switch (promptName) {
        case Dictionary.Purpose.Summary:
          prompt = getSummaryPrompt(variables.transcript, variables.language)
          break
        case Dictionary.Purpose.Topics:
          prompt = getTopicsPrompt(variables.transcript, variables.language)
          break
        case Dictionary.Purpose.SocialMedia:
          prompt = getSocialPostPrompt(variables.transcript, variables.language)
          break
        case Dictionary.Purpose.Custom:
          prompt = getCustomOutputPrompt(
            variables.transcript,
            variables.language,
            variables.customPrompt
          )
          break
        default:
          throw new Error(`Unknown prompt name: ${promptName}`)
      }

      return prompt
    } catch (error) {
      throw new Error(`Failed to load prompt '${promptName}': ${error}`)
    }
  }

  static getAvailablePrompts(): PurposeValue[] {
    return Object.values(Dictionary.Purpose)
  }
}
