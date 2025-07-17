export const SELECTORS = {
  COOKIE_CONSENT:
    'ytd-button-renderer.style-scope.ytd-consent-bump-v2-lightbox button[aria-label*="Reject"]',
  EXPAND_BUTTON: 'tp-yt-paper-button#expand',
  SHOW_TRANSCRIPT:
    'div#primary-button.style-scope.ytd-video-description-transcript-section-renderer ytd-button-renderer yt-button-shape button.yt-spec-button-shape-next',

  TITLE: 'div#title h1 yt-formatted-string',
  DESCRIPTION: 'div#expanded yt-attributed-string',

  BODY: 'body',
} as const

export const API_ENDPOINTS = {
  TRANSCRIPT: '/youtubei/v1/get_transcript',
} as const
