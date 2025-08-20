import { FORM_FIELD_NAMES } from '../../constants/formConstants'

export const PurposeDefaultValue = {
  [FORM_FIELD_NAMES.PURPOSE]: 'custom',
  [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: '',
  options: {
    generateMindMap: true,
    generateSocialPost: true,
    customPrompt: '',
    generateSummary: false,
    generateKeyPoints: false,
    generateQuestions: false,
  },
}
