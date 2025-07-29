/**
 * Types for YouTube transcript functionality
 */

export interface TranscriptResult {
  transcript: string
  title: string
  description: string
}

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
