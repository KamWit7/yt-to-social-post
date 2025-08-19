"use client";

import { useTranscript } from "@/api/hooks/useTranscript";
import { AnimatedSection } from "@/components/animation";
import { ControlledInput, SubmitButton } from "@/components/common";
import SectionHeader from "@/components/ui/SectionHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2, Youtube } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ErrorDisplay } from "../../components";
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from "../../components/Section.helpers";
import {
  FORM_FIELD_NAMES,
  LOADING_MESSAGES,
} from "../../constants/formConstants";
import type { YouTubeFormData } from "../../types/formTypes";
import { YouTubeDefaultValue } from "./YouTubeForm.helpers";
import { youtubeSchema } from "./youtubeSchema";

type YouTubeFormProps = {
  onSubmit?: (transcript: string) => void;
};

export function YouTubeForm({ onSubmit }: YouTubeFormProps) {
  const methods = useForm<YouTubeFormData>({
    resolver: zodResolver(youtubeSchema),
    mode: "onChange",
    defaultValues: YouTubeDefaultValue,
  });

  const { watch, handleSubmit } = methods;

  const url = watch(FORM_FIELD_NAMES.URL);

  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    isFetching: isTranscriptFetching,
    isSuccess: isTranscriptSuccess,
    error: transcriptError,
    refetch: refetchTranscript,
  } = useTranscript(url, {
    enabled: false,
    retry: 2,
  });

  useEffect(() => {
    if (
      transcriptData?.success &&
      transcriptData.data?.transcript &&
      isTranscriptSuccess
    ) {
      onSubmit?.(transcriptData.data.transcript);
    }
  }, [transcriptData, onSubmit, isTranscriptSuccess]);

  const onSubmitForm = async () => {
    await refetchTranscript();
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
        <div className="space-y-12">
          <AnimatedSection
            isVisible
            delay={ANIMATION_DELAYS.section}
            className="space-y-8"
          >
            <SectionHeader
              icon={<Youtube className="w-6 h-6 text-white" />}
              title="Podaj Link z YouTube"
              subtitle="Wklej link do filmu YouTube lub zostaw puste, aby wkleić transkrypcję ręcznie"
              iconBgColor="bg-gradient-to-r from-red-500 to-red-600"
            />

            <div className="space-y-6">
              <ControlledInput
                name={FORM_FIELD_NAMES.URL}
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isTranscriptLoading}
                icon={<Youtube className="w-5 h-5" />}
                type="url"
                autoComplete="url"
              />

              <SubmitButton
                disabled={!url}
                isLoading={isTranscriptFetching}
                loadingText={LOADING_MESSAGES.FETCHING_TRANSCRIPT}
                normalText="Wygeneruj Transkrypcję"
                icon={Wand2}
                className={BUTTON_STYLES.youtubeFullWidth}
              />

              {transcriptError && (
                <ErrorDisplay
                  error={transcriptError}
                  isRetrying={isTranscriptLoading}
                  showBackButton={false}
                />
              )}
            </div>
          </AnimatedSection>
        </div>
      </form>
    </FormProvider>
  );
}
