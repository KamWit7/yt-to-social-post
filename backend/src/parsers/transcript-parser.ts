import {
  TranscriptResult,
  YouTubeTranscriptResponse,
} from '../types/transcript.types'
import { ERROR_MESSAGES, ErrorHandler } from '../utils/errors'
import { isValidYouTubeUrl } from '../utils/validation'

interface TranscriptFormatOptions {
  segmentSeparator?: string
  preserveNewlines?: boolean
  addTimestamps?: boolean
}

export class TranscriptParser {
  static formatSegmentText(
    text?: string,
    options: TranscriptFormatOptions = {}
  ): string {
    const { preserveNewlines = true } = options

    if (preserveNewlines) {
      return text?.replace(/\\n/g, '\n') ?? ''
    } else {
      return text?.replace(/\\n/g, ' ') ?? ''
    }
  }

  static extractTranscriptText(
    data: YouTubeTranscriptResponse,
    options: TranscriptFormatOptions = {}
  ): string {
    const segments =
      data.actions?.[0]?.updateEngagementPanelAction?.content
        ?.transcriptRenderer?.content?.transcriptSearchPanelRenderer?.body
        ?.transcriptSegmentListRenderer?.initialSegments

    if (!segments) {
      return ERROR_MESSAGES.TRANSCRIPT_NOT_AVAILABLE
    }

    const { segmentSeparator = ' ' } = options

    const textParts = segments?.map((segment) => {
      let segmentText = ''

      if (segment?.transcriptSegmentRenderer) {
        const rawText = segment?.transcriptSegmentRenderer?.snippet?.runs
          ?.map((run) => run.text)
          ?.join('')

        segmentText = TranscriptParser.formatSegmentText(rawText, options)
      } else if (segment?.transcriptSectionHeaderRenderer) {
        const rawText =
          segment?.transcriptSectionHeaderRenderer?.sectionHeader
            ?.sectionHeaderViewModel?.headline?.content
        segmentText = TranscriptParser.formatSegmentText(rawText, options)
      }

      return segmentText
    })

    const filteredParts = textParts.filter((part) => part.trim() !== '')

    return filteredParts.join(segmentSeparator).trim()
  }

  static isValidTranscriptResponse(
    data: any
  ): data is YouTubeTranscriptResponse {
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

  static getTranscriptFormatOptions(): TranscriptFormatOptions {
    return {
      segmentSeparator: ' ',
      preserveNewlines: true,
    }
  }

  static formatTranscriptResponse(
    transcriptData: unknown,
    title?: string | null,
    description?: string | null
  ): TranscriptResult {
    const parsedTitle = title ?? ERROR_MESSAGES.TITLE_NOT_FOUND
    const parsedDescription =
      description ?? ERROR_MESSAGES.DESCRIPTION_NOT_FOUND

    if (!transcriptData) {
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_NOT_FOUND,
        title: parsedTitle,
        description: parsedDescription,
        success: false,
      }
    }

    const isValid = TranscriptParser.isValidTranscriptResponse(transcriptData)

    if (!isValid) {
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_FORMAT_NOT_RECOGNIZED,
        title: parsedTitle,
        description: parsedDescription,
        success: false,
      }
    }

    const extractedText = TranscriptParser.extractTranscriptText(
      transcriptData,
      TranscriptParser.getTranscriptFormatOptions()
    )

    if (!extractedText) {
      return {
        transcript: ERROR_MESSAGES.TRANSCRIPT_PROCESSING_ERROR,
        title: parsedTitle,
        description: parsedDescription,
        success: false,
      }
    }

    return {
      transcript: extractedText,
      title: parsedTitle,
      description: parsedDescription,
      success: true,
    }
  }

  static validateUrl(url?: unknown): void | Error {
    if (url && typeof url === 'string' && isValidYouTubeUrl(url)) {
      return
    }

    ErrorHandler.handleValidationError('Invalid YouTube URL', url)
  }
}
