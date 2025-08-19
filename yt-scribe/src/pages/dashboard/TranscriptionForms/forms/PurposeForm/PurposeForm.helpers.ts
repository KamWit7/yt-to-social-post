import { FORM_FIELD_NAMES } from "../../constants/formConstants";

export const PurposeDefaultValue = {
  [FORM_FIELD_NAMES.PURPOSE]: "",
  [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: "",
  options: {
    generateMindMap: false,
    generateSocialPost: false,
    customPrompt: "",
    generateSummary: false,
    generateKeyPoints: false,
    generateQuestions: false,
  },
};
