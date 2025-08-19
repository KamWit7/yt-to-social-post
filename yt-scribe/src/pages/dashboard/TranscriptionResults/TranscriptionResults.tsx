"use client";

import { getAIProcessingQueryKey } from "@/api/hooks/useAIProcessing";
import { CopyButton } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCachedMutation } from "@/hooks/useCachedMutation";
import { AIProcessingResponse, ApiResponse } from "@/types";
import { Brain, Edit, FileText, Hash, MessageSquare, Save } from "lucide-react";
import { useState } from "react";

interface TranscriptionResultsProps {
  transcript?: string;
}

export default function TranscriptionResults({
  transcript,
}: TranscriptionResultsProps) {
  const { data, error } = useCachedMutation<ApiResponse<AIProcessingResponse>>(
    getAIProcessingQueryKey(),
  );

  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(transcript || "");

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-medium">Wystąpił błąd podczas przetwarzania</p>
            <p className="text-sm mt-1">{error?.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.success || !data.data) {
    return null;
  }

  const handleCancelEdit = () => {
    setEditedTranscript(transcript || "");
    setIsEditingTranscript(false);
  };

  return (
    <div className="space-y-6">
      {transcript && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Transkrypcja
              </div>
              <div className="flex gap-2">
                {!isEditingTranscript ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingTranscript(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edytuj
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingTranscript(false)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Zapisz
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Anuluj
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingTranscript ? (
              <Textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                rows={8}
                className="w-full"
              />
            ) : (
              <div className="whitespace-pre-line text-sm leading-7 max-h-64 overflow-y-auto">
                {transcript}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Streszczenie */}
      {data.data.summary && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Streszczenie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm leading-7 flex-1">{data.data.summary}</p>
              <CopyButton
                text={data.data.summary || ""}
                className="shrink-0"
                aria-label="Kopiuj streszczenie"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tematy */}
      {data.data.topics && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Kluczowe tematy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 whitespace-pre-line text-sm leading-7">
                {data.data.topics}
              </div>
              <CopyButton
                text={data.data.topics || ""}
                className="shrink-0"
                aria-label="Kopiuj tematy"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa myśli */}
      {data.data.mindMap && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Mapa myśli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-4">
              <pre className="flex-1 text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
                {JSON.stringify(data.data.mindMap, null, 2)}
              </pre>
              <CopyButton
                text={JSON.stringify(data.data.mindMap, null, 2)}
                className="shrink-0"
                aria-label="Kopiuj mapę myśli JSON"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post na social media */}
      {data.data.socialPost && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Post na social media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 whitespace-pre-line text-sm leading-7">
                {data.data.socialPost}
              </div>
              <CopyButton
                text={data.data.socialPost || ""}
                className="shrink-0"
                aria-label="Kopiuj post na social media"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Własne polecenie */}
      {data.data.customOutput && (
        <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Wynik własnego polecenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 whitespace-pre-line text-sm leading-7">
                {data.data.customOutput}
              </div>
              <CopyButton
                text={data.data.customOutput || ""}
                className="shrink-0"
                aria-label="Kopiuj wynik własnego polecenia"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
