/**
 * Parameters required for YouTube transcript API request
 */
export interface TranscriptParams {
  apiUrl: string
  params: string
}

/**
 * YouTube client context for API requests
 */
export interface YouTubeContext {
  client: {
    clientName: string
    clientVersion: string
    hl: string
    gl: string
    remoteHost?: string
    deviceMake?: string
    deviceModel?: string
    visitorData?: string
    userAgent?: string
    osName?: string
    osVersion?: string
    originalUrl?: string
    screenPixelDensity?: number
    platform?: string
    clientFormFactor?: string
    configInfo?: any
    coldConfigData?: string
    coldHashData?: string
    hotHashData?: string
  }
  screenDensityFloat?: number
  userInterfaceTheme?: string
  timeZone?: string
  browserName?: string
  browserVersion?: string
  acceptHeader?: string
  deviceExperimentId?: string
  rolloutToken?: string
  screenWidthPoints?: number
  screenHeightPoints?: number
  utcOffsetMinutes?: number
  connectionType?: string
  memoryTotalKbytes?: string
  mainAppWebInfo?: any
  user?: {
    lockedSafetyMode: boolean
  }
  request?: {
    useSsl: boolean
    internalExperimentFlags: any[]
    consistencyTokenJars: any[]
  }
  clickTracking?: {
    clickTrackingParams: string
  }
  adSignalsInfo?: {
    params: Array<{ key: string; value: string }>
    bid: string
  }
}

/**
 * Request body for YouTube transcript API call
 */
export interface TranscriptRequestBody {
  context: YouTubeContext
  params: string
  externalVideoId?: string
}

/**
 * Data extracted from YouTube HTML page
 */
export interface YouTubeExtractedData {
  context?: YouTubeContext
  transcriptParams?: TranscriptParams
  videoId?: string
  title?: string
  description?: string
}
export type TranscriptData = {
  transcript?: string | undefined
  title?: string | undefined
  description?: string | undefined
}
