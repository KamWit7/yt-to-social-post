/**
 * Types for YouTube transcript functionality
 */

import { IYouTubeTranscriptOrchestrator } from '../interfaces/youtube-orchestrator.interface'

export type TranscriptResult = Awaited<
  ReturnType<IYouTubeTranscriptOrchestrator['getTranscript']>
>

// YouTube Transcript API Types
export interface TranscriptRun {
  text: string
}

export interface TranscriptSegmentRenderer {
  snippet: {
    runs: TranscriptRun[]
  }
}

export interface TranscriptSectionHeaderRenderer {
  sectionHeader: {
    sectionHeaderViewModel: {
      headline: {
        content: string
      }
    }
  }
}

export type TranscriptSegment = {
  transcriptSegmentRenderer?: TranscriptSegmentRenderer
  transcriptSectionHeaderRenderer?: TranscriptSectionHeaderRenderer
}

export interface YouTubeTranscriptResponse {
  actions: {
    updateEngagementPanelAction: {
      content: {
        transcriptRenderer: {
          content: {
            transcriptSearchPanelRenderer: {
              body: {
                transcriptSegmentListRenderer: {
                  initialSegments: TranscriptSegment[]
                }
              }
            }
          }
        }
      }
    }
  }[]
}
