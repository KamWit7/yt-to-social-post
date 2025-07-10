import { YoutubeTranscript } from 'youtube-transcript'
import ytdl from 'ytdl-core'
import type {
  DescriptionResponse,
  TranscriptResponse,
} from '../types/youtube'
import { validateAndExtractVideoId } from '../utils/validation'

export class YouTubeService {
  static async getTranscript(url: string): Promise<TranscriptResponse> {
    const { isValid, videoId } = validateAndExtractVideoId(url)

    if (!isValid || !videoId) {
      throw new Error('Invalid YouTube URL')
    }

    try {
      const transcript = await YoutubeTranscript.fetchTranscript(url)
      return { transcript }
    } catch (error) {
      throw new Error(
        `Failed to fetch transcript: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  static async getDescription(url: string): Promise<DescriptionResponse> {
    const { isValid } = validateAndExtractVideoId(url)

    if (!isValid) {
      throw new Error('Invalid YouTube URL')
    }

    try {
      const info = await ytdl.getInfo(url)
      const description =
        info.videoDetails.description || 'No description available'

      return { description }
    } catch (error) {
      throw new Error(
        `Failed to fetch description: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }

  static async getVideoInfo(url: string) {
    const { isValid, videoId } = validateAndExtractVideoId(url)

    if (!isValid || !videoId) {
      throw new Error('Invalid YouTube URL')
    }

    try {
      const info = await ytdl.getInfo(url)
      return {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        lengthSeconds: info.videoDetails.lengthSeconds,
        viewCount: info.videoDetails.viewCount,
        videoId,
      }
    } catch (error) {
      throw new Error(
        `Failed to fetch video info: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
    }
  }
}
