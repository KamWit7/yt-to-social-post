import { ERROR_MESSAGES } from './errors'
import type { YouTubeTranscriptResponse } from './types'

export interface TranscriptFormatOptions {
  segmentSeparator?: string
  preserveNewlines?: boolean
  addTimestamps?: boolean
}

const formatSegmentText = (
  text: string,
  options: TranscriptFormatOptions = {}
): string => {
  const { preserveNewlines = true } = options

  if (preserveNewlines) {
    return text.replace(/\\n/g, '\n')
  } else {
    return text.replace(/\\n/g, ' ')
  }
}

export const extractTranscriptText = (
  data: YouTubeTranscriptResponse,
  options: TranscriptFormatOptions = {}
): string => {
  const segments =
    data.actions?.[0]?.updateEngagementPanelAction?.content?.transcriptRenderer
      ?.content?.transcriptSearchPanelRenderer?.body
      ?.transcriptSegmentListRenderer?.initialSegments

  if (!segments) {
    return ERROR_MESSAGES.TRANSCRIPT_NOT_AVAILABLE
  }

  const { segmentSeparator = ' ' } = options

  const textParts = segments.map((segment) => {
    let segmentText = ''

    if (segment.transcriptSegmentRenderer) {
      const rawText = segment.transcriptSegmentRenderer.snippet.runs
        .map((run) => run.text)
        .join('')
      segmentText = formatSegmentText(rawText, options)
    } else if (segment.transcriptSectionHeaderRenderer) {
      const rawText =
        segment.transcriptSectionHeaderRenderer.sectionHeader
          .sectionHeaderViewModel.headline.content
      segmentText = formatSegmentText(rawText, options)
    }

    return segmentText
  })

  const filteredParts = textParts.filter((part) => part.trim() !== '')

  return filteredParts.join(segmentSeparator).trim()
}

export const isValidTranscriptResponse = (
  data: any
): data is YouTubeTranscriptResponse => {
  return (
    data &&
    data.actions &&
    Array.isArray(data.actions) &&
    data.actions.length > 0 &&
    data.actions[0].updateEngagementPanelAction &&
    data.actions[0].updateEngagementPanelAction.content &&
    data.actions[0].updateEngagementPanelAction.content.transcriptRenderer
  )
}
