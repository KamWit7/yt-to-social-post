# YouTube Endpoints

## Overview

YouTube endpoints provide functionality to extract and process video transcripts from YouTube videos. These endpoints enable users to fetch video transcripts, parse them into structured formats, and prepare them for further processing by AI services.

## Endpoints

### GET /api/transcript

**Purpose**: Fetches and parses YouTube video transcripts from a provided video URL.

**Authentication**: None required

**Request Format**:

- **Method**: GET
- **Query Parameters**: `url` (required) - YouTube video URL

**Request Schema**:

```
GET /api/transcript?url={youtube_video_url}
```

**URL Validation Rules**:

- Must be a valid YouTube video URL
- Supports various YouTube URL formats:
  - `https://www.youtube.com/watch?v={video_id}`
  - `https://youtu.be/{video_id}`
  - `https://youtube.com/watch?v={video_id}`
- Video must have available transcripts/subtitles

**Response Format**:

```json
{
  "success": true,
  "data": {
    "transcript": "string",
    "videoInfo": {
      "title": "string",
      "author": "string",
      "duration": "string",
      "url": "string"
    },
    "metadata": {
      "language": "string",
      "wordCount": "number",
      "extractionTime": "string"
    }
  }
}
```

**Status Codes**:

- `200 OK`: Transcript successfully extracted and parsed
- `400 Bad Request`: Invalid YouTube URL or missing URL parameter
- `404 Not Found`: Video not found or no transcripts available
- `500 Internal Server Error`: Extraction or parsing error

**Error Cases**:

- Invalid or malformed YouTube URL
- Video does not exist or is private
- No transcripts/subtitles available for the video
- Transcript extraction service unavailable
- Parsing errors during transcript processing
- Network connectivity issues

**Example Request**:

```bash
curl -X GET "http://localhost:3000/api/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "transcript": "Never gonna give you up, never gonna let you down. Never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye. Never gonna tell a lie and hurt you.",
    "videoInfo": {
      "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      "author": "Rick Astley",
      "duration": "3:33",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    "metadata": {
      "language": "en",
      "wordCount": 45,
      "extractionTime": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Implementation Details

### Architecture

The YouTube transcript endpoint follows the orchestrator pattern for complex operations:

- **Controller**: `YouTubeController` handles HTTP concerns and URL validation
- **Orchestrator**: `YouTubeTranscriptOrchestratorService` coordinates complex operations
- **Service**: `YouTubeService` handles YouTube API interactions
- **Parser**: `TranscriptParser` validates URLs and processes transcript data
- **Validation**: URL validation through dedicated parser utility

### Key Features

1. **URL Validation**: Comprehensive YouTube URL format validation
2. **Transcript Extraction**: Fetches video transcripts using YouTube API
3. **Video Metadata**: Extracts additional video information
4. **Error Handling**: Graceful handling of various failure scenarios
5. **Structured Output**: Consistent response format with metadata

### URL Support

The endpoint supports multiple YouTube URL formats:

- **Standard URLs**: `https://www.youtube.com/watch?v={video_id}`
- **Short URLs**: `https://youtu.be/{video_id}`
- **Mobile URLs**: `https://m.youtube.com/watch?v={video_id}`
- **Embed URLs**: `https://www.youtube.com/embed/{video_id}`

### Transcript Processing

#### Available Transcript Types

- **Auto-generated**: YouTube's automatic speech recognition
- **Manual**: User-uploaded subtitle files
- **Community**: Community-contributed subtitles
- **Multiple Languages**: Support for various language tracks

#### Processing Features

- **Language Detection**: Identifies transcript language
- **Word Count**: Calculates transcript length
- **Format Standardization**: Consistent output format
- **Quality Assessment**: Validates transcript completeness

### Use Cases

- **Content Analysis**: Extract video content for analysis
- **AI Processing**: Prepare transcripts for AI content generation
- **Accessibility**: Provide text alternatives for video content
- **Research**: Collect video content for research purposes
- **Content Creation**: Use video transcripts for article writing
- **Language Learning**: Extract transcripts for language study

### Performance Considerations

- **Caching**: Transcript results could be cached to avoid re-extraction
- **Async Processing**: Non-blocking transcript extraction
- **Timeout Handling**: Prevents hanging on slow video processing
- **Resource Management**: Efficient memory usage for large transcripts
- **Rate Limiting**: Respects YouTube API rate limits

### Error Handling

- **URL Validation**: Clear error messages for invalid URLs
- **Video Availability**: Proper handling of private or deleted videos
- **Transcript Availability**: Graceful handling when transcripts are unavailable
- **Network Errors**: Retry logic for temporary connectivity issues
- **Service Errors**: Fallback mechanisms for API failures

### Security Notes

- **URL Sanitization**: All URLs are validated and sanitized
- **No Data Persistence**: Transcripts are processed in-memory only
- **Rate Limiting**: Protection against excessive API usage
- **Input Validation**: Comprehensive URL format validation
- **Error Sanitization**: Internal errors are not exposed to clients

### Integration Notes

- **YouTube API**: Integration with YouTube Data API v3
- **Transcript Service**: Uses YouTube's transcript extraction service
- **Response Format**: Consistent with API response standards
- **Type Safety**: Full TypeScript support with proper typing
- **Error Codes**: Standardized error response format

### Limitations

- **Transcript Availability**: Only works with videos that have transcripts
- **Language Support**: Limited to languages with available transcripts
- **Video Privacy**: Cannot access transcripts from private videos
- **API Quotas**: Subject to YouTube API usage limits
- **Processing Time**: Large videos may take longer to process

### Best Practices

- **URL Validation**: Always validate YouTube URLs before processing
- **Error Handling**: Implement proper error handling for all failure cases
- **Caching**: Consider caching frequently requested transcripts
- **Rate Limiting**: Respect API rate limits to avoid service disruption
- **Monitoring**: Track usage patterns and error rates
