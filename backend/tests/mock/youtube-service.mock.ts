import { jest } from '@jest/globals'
import { YouTubeService } from '../../src/services/youtube.service'

const mockFetchPage = (
  videoId: string = 'mock-video-id',
  error: boolean = false
) =>
  jest.spyOn(YouTubeService.prototype, 'fetchPage').mockResolvedValue(
    error
      ? null
      : `
      <html>
        <script>
          var ytInitialData = {"videoId":"${videoId}","getTranscriptEndpoint":{"params":"mock-transcript-params"},"apiUrl":"/youtubei/v1/get_transcript"};
        </script>
        <script>
          ytcfg.set({"INNERTUBE_CONTEXT":{"client":{"clientName":"WEB","clientVersion":"2.20250725.01.00","hl":"pl","gl":"PL"}},"VISITOR_DATA":"mock-visitor-data"});
        </script>
      </html>
    `
  )

const mockFetchTranscript = (
  transcript: string = 'mock-transcript',
  error: boolean = false
) =>
  jest.spyOn(YouTubeService.prototype, 'fetchTranscript').mockResolvedValue(
    error
      ? null
      : {
          actions: [
            {
              updateEngagementPanelAction: {
                content: {
                  transcriptRenderer: {
                    content: {
                      transcriptSearchPanelRenderer: {
                        body: {
                          transcriptSegmentListRenderer: {
                            initialSegments: [
                              {
                                transcriptSegmentRenderer: {
                                  snippet: {
                                    runs: [{ text: transcript }],
                                  },
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        }
  )

const mockIsValidYouTubeUrl = (isValid: boolean = true) =>
  jest
    .spyOn(YouTubeService.prototype, 'isValidYouTubeUrl')
    .mockReturnValue(isValid)

const mockExtractVideoIdFromUrl = (videoId: string = 'mock-video-id') =>
  jest
    .spyOn(YouTubeService.prototype, 'extractVideoIdFromUrl')
    .mockReturnValue(videoId)

const mockHasTranscriptData = (hasTranscriptData: boolean = true) =>
  jest
    .spyOn(YouTubeService.prototype, 'hasTranscriptData')
    .mockReturnValue(hasTranscriptData)

const mockDisplayErrorReasons = () =>
  jest
    .spyOn(YouTubeService.prototype, 'displayErrorReasons')
    .mockImplementation(() => {})

const mockDisplayTranscriptInfo = () =>
  jest
    .spyOn(YouTubeService.prototype, 'displayTranscriptInfo')
    .mockImplementation(() => {})

export {
  mockDisplayErrorReasons,
  mockDisplayTranscriptInfo,
  mockExtractVideoIdFromUrl,
  mockFetchPage,
  mockFetchTranscript,
  mockHasTranscriptData,
  mockIsValidYouTubeUrl,
}
