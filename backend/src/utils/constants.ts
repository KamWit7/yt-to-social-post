/**
 * YouTube API constants and configuration
 */
export const YOUTUBE_CONSTANTS = {
  /**
   * API endpoints and URLs
   */
  API: {
    BASE_URL: 'https://www.youtube.com',
    TRANSCRIPT_ENDPOINT: '/youtubei/v1/get_transcript',
  },

  /**
   * Client configuration
   */
  CLIENT: {
    NAME: '1',
    VERSION: '2.20250725.01.00',
    USER_AGENT:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  },

  /**
   * Regular expressions for parsing YouTube HTML
   */
  REGEX: {
    YTCFG: /ytcfg\.set\(({.+?})\)/,
    VIDEO_ID: /"videoId":"([^"]+)"|watch\?v=([^&"]+)/,
    TRANSCRIPT_ENDPOINT: /"getTranscriptEndpoint":\s*{\s*"params":\s*"([^"]+)"/,
    API_URL: /"apiUrl"\s*:\s*"(\/youtubei\/v1\/get_transcript)"/,
    TITLE:
      /<title[^>]*>([^<]+)<\/title>|<meta[^>]*property="og:title"[^>]*content="([^"]+)"/,
    DESCRIPTION:
      /<meta[^>]*name="description"[^>]*content="([^"]+)"|<meta[^>]*property="og:description"[^>]*content="([^"]+)"/,
  },

  /**
   * Default values for YouTube context
   */
  DEFAULT_VALUES: {
    LOCALE: 'pl',
    COUNTRY: 'PL',
    PLATFORM: 'DESKTOP',
    CLIENT_FORM_FACTOR: 'UNKNOWN_FORM_FACTOR',
  },
} as const
