# AI Processing Endpoints

## Overview

AI processing endpoints provide intelligent transcript analysis and content generation capabilities. These endpoints leverage AI services to transform YouTube video transcripts into various useful formats including mind maps, social media posts, and custom content based on specific purposes.

## Endpoints

### POST /api/ai/process-transcript

**Purpose**: Processes YouTube video transcripts using AI to generate various content formats based on specified purpose and options.

**Authentication**: None required

**Request Format**:

- **Content-Type**: `application/json`
- **Body**: JSON object with transcript, purpose, and processing options

**Request Schema**:

```json
{
  "transcript": "string (required, non-empty)",
  "purpose": "learning | social_media | custom",
  "options": {
    "generateMindMap": "boolean (optional)",
    "generateSocialPost": "boolean (optional)",
    "customPrompt": "string (optional)"
  }
}
```

**Validation Rules**:

- `transcript`: Must be a non-empty string
- `purpose`: Must be one of the predefined values
- `options`: At least one option must be selected (generateMindMap, generateSocialPost, or customPrompt)

**Response Format**:

```json
{
  "success": true,
  "mindMap": "string (if requested)",
  "socialPost": "string (if requested)",
  "customContent": "string (if requested)",
  "metadata": {
    "processingTime": "number",
    "modelUsed": "string",
    "tokensUsed": "number"
  }
}
```

**Status Codes**:

- `200 OK`: Processing completed successfully
- `400 Bad Request`: Invalid request format or validation errors
- `500 Internal Server Error`: AI processing error or service unavailable

**Error Cases**:

- Empty or invalid transcript
- Invalid purpose value
- No processing options selected
- AI service unavailable
- Processing timeout
- Invalid custom prompt

**Example Request**:

```bash
curl -X POST http://localhost:3000/api/ai/process-transcript \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "In this video, we explore the fundamentals of machine learning...",
    "purpose": "learning",
    "options": {
      "generateMindMap": true,
      "generateSocialPost": true
    }
  }'
```

**Example Response**:

```json
{
  "success": true,
  "mindMap": "Machine Learning\n├── Supervised Learning\n│   ├── Classification\n│   └── Regression\n├── Unsupervised Learning\n│   ├── Clustering\n│   └── Dimensionality Reduction\n└── Deep Learning\n    ├── Neural Networks\n    └── Convolutional Networks",
  "socialPost": "🧠 Just learned about the core concepts of Machine Learning! From supervised vs unsupervised learning to deep neural networks - the future of AI is fascinating! #MachineLearning #AI #TechEducation",
  "metadata": {
    "processingTime": 2.5,
    "modelUsed": "gpt-4",
    "tokensUsed": 1250
  }
}
```

## Implementation Details

### Architecture

The AI processing endpoint follows the established layered architecture with lazy initialization:

- **Controller**: `AIController` handles HTTP concerns and request validation
- **Service**: `AIProcessingService` contains AI processing business logic
- **Validation**: Zod schemas ensure request integrity
- **Lazy Loading**: Services initialized only when needed for environment loading

### Key Features

1. **Multi-Purpose Processing**: Supports learning, social media, and custom purposes
2. **Flexible Output Options**: Generate mind maps, social posts, or custom content
3. **Input Validation**: Comprehensive validation with Polish error messages
4. **Lazy Service Initialization**: Efficient resource management
5. **Metadata Tracking**: Processing statistics and model information

### Processing Options

#### Purpose Types

- **`learning`**: Optimized for educational content and knowledge extraction
- **`social_media`**: Tailored for social media engagement and sharing
- **`custom`**: Allows custom prompts for specialized use cases

#### Output Options

- **`generateMindMap`**: Creates hierarchical mind map structure
- **`generateSocialPost`**: Generates engaging social media content
- **`customPrompt`**: Processes with user-defined custom instructions

### Use Cases

- **Educational Content**: Convert video transcripts into structured learning materials
- **Social Media Marketing**: Generate engaging posts from educational content
- **Content Summarization**: Extract key points and create summaries
- **Custom Analysis**: Apply specialized prompts for specific domains
- **Research Support**: Process academic or technical content

### Performance Considerations

- **Lazy Initialization**: AI services loaded only when needed
- **Async Processing**: Non-blocking AI operations
- **Timeout Handling**: Prevents hanging requests
- **Resource Management**: Efficient memory and token usage
- **Caching Potential**: Results could be cached for repeated requests

### Error Handling

- **Validation Errors**: Clear Polish error messages for invalid inputs
- **Service Errors**: Graceful handling of AI service failures
- **Timeout Errors**: Automatic cancellation of long-running operations
- **Rate Limiting**: Protection against excessive API usage

### Security Notes

- **Input Sanitization**: All user inputs are validated and sanitized
- **No Data Persistence**: Transcripts are processed in-memory only
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Error Sanitization**: Internal errors are not exposed to clients

### Integration Notes

- **Environment Variables**: AI service configuration via environment
- **Service Dependencies**: External AI service integration
- **Response Format**: Consistent with API response standards
- **Type Safety**: Full TypeScript support with proper typing
