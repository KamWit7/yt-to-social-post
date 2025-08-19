import { YOUTUBE_URL_PATTERNS } from "@/utils/constants";
import { z } from "zod";
import { FORM_FIELD_NAMES } from "../../constants/formConstants";

export const youtubeSchema = z.object({
  [FORM_FIELD_NAMES.URL]: z
    .string()
    .min(1, "Proszę wprowadzić link YouTube")
    .refine(
      (url) => YOUTUBE_URL_PATTERNS.some((pattern) => pattern.test(url.trim())),
      "Proszę wprowadzić prawidłowy link YouTube",
    ),
});
