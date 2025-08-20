import { z } from "zod";
import { FORM_FIELD_NAMES } from "../../constants/formConstants";

export const transcriptSchema = z.object({
  [FORM_FIELD_NAMES.TRANSCRIPT]: z
    .string()
    .min(1, "Transkrypcja jest wymagana")
    .min(10, "Transkrypcja musi mieć co najmniej 10 znaków"),
});
