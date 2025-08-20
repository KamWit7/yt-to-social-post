import { FORM_FIELD_NAMES } from "../../constants/formConstants";

export const getTranscriptDefaultValues = (transcript: string = "") => ({
  [FORM_FIELD_NAMES.TRANSCRIPT]: transcript,
});
