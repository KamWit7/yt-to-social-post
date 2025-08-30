# YouTube to Social Post - Backend API

Backend API for processing YouTube transcripts using AI (Google Gemini) and generating various types of content. This service provides intelligent transcript analysis without requiring YouTube Data API v3 keys by directly parsing YouTube pages.

## 🚀 Features

- **AI-Powered Processing**: Google Gemini integration for intelligent content generation
- **Multiple Output Types**: Generate summaries, key topics, mind maps, and social media posts
- **Purpose-Based Processing**: Tailored content generation based on user goals
- **Transcript Extraction**: Direct YouTube page parsing without API keys
- **Rate Limiting**: Built-in protection against API abuse
- **Security**: Comprehensive security headers and CORS protection
- **TypeScript**: Full type safety and modern development experience

## 🛠️ Technologies Used

### Core Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Web framework for building APIs
- **Google Generative AI** - Gemini AI integration

### Development & Testing

- **Jest** - Testing framework
- **ESLint** - Code linting and quality
- **Nodemon** - Development server with hot reload
- **Supertest** - API testing utilities

### Security & Middleware

- **Helmet** - Security headers and protection
- **CORS** - Cross-origin resource sharing
- **Express Rate Limiter** - Request rate limiting
- **Input Validation** - URL validation and sanitization

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key (for AI processing)

## 🚀 Installation

```bash
cd backend
npm install
```

## 🔧 Configuration

### 1. Environment Setup

Create a `.env` file from the example:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here

# Security & CORS
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Note**: This API doesn't require YouTube Data API v3 keys as it directly parses YouTube pages.

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## 📡 API Endpoints

### POST /api/process

Process YouTube transcript with AI to generate various content types.

**Request Body:**

```json
{
  "transcript": "YouTube transcript text...",
  "purpose": "learning|work|content_creation|general",
  "options": {
    "generateMindMap": true,
    "generateSocialPost": false,
    "customInstruction": "Optional custom instruction"
  }
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary...",
    "keyTopics": ["Topic 1", "Topic 2", "Topic 3"],
    "mindMap": "Mind map content...",
    "socialPost": "Social media post content...",
    "customOutput": "Custom instruction output..."
  }
}
```

### GET /api/transcript

Extract transcript from a YouTube video by parsing the video page directly.

**Query Parameters:**

- `url` (string, required) - YouTube video URL

**Example Request:**

```bash
GET /api/transcript?url=https://www.youtube.com/watch?v=dh6BCSzaF6g
```

**Success Response:**

```json
{
  "success": true,
  "transcript": "Full transcript text here...",
  "title": "Video Title",
  "description": "Video description..."
}
```

### GET /api/health

Health check endpoint to verify server status.

**Response:**

```json
{
  "success": true,
  "message": "YouTube Transcript API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
npm run test:endpoints    # API endpoint tests
npm run test:middleware   # Middleware tests
npm run test:integration  # Integration tests
npm run test:services     # Service layer tests
```

### Test Coverage

```bash
npm run test:coverage
```

### Load Testing

```bash
npm run test:load         # Basic load test
npm run test:load:heavy   # Heavy load test (10 runs)
```

### Watch Mode

```bash
npm run test:watch
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## 🔒 Security Features

- **Helmet**: Comprehensive security headers
- **CORS**: Configurable cross-origin request handling
- **Rate Limiting**: Prevents API abuse and DDoS attacks
- **Input Validation**: YouTube URL validation and data sanitization
- **Error Handling**: Secure error messages without information leakage
- **Request Logging**: Comprehensive request/response logging

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/          # API controllers
│   │   ├── transcript.controller.ts
│   │   ├── process.controller.ts
│   │   └── health.controller.ts
│   ├── services/             # Business logic services
│   │   ├── youtube.service.ts
│   │   ├── ai-processing.service.ts
│   │   ├── youtube-transcript-orchestrator.service.ts
│   │   └── health.service.ts
│   ├── parsers/              # HTML and transcript parsing
│   │   ├── youtube.parser.ts
│   │   └── transcript.parser.ts
│   ├── middleware/           # Express middleware
│   │   ├── cors.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error-handler.middleware.ts
│   ├── routes/               # API routes
│   │   ├── transcript.routes.ts
│   │   ├── process.routes.ts
│   │   └── health.routes.ts
│   ├── types/                # TypeScript type definitions
│   ├── interfaces/           # Service interfaces
│   ├── utils/                # Utility functions
│   ├── cors/                 # CORS configuration
│   └── server.ts             # Main server file
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── load/                 # Load tests
├── scripts/                  # Utility scripts
├── api-tests.rest           # REST Client test file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 How It Works

### Transcript Processing Flow

1. **Input Validation** - Validate transcript text and processing options
2. **AI Processing** - Send transcript to Google Gemini with purpose-specific prompts
3. **Content Generation** - Generate requested content types (summary, topics, etc.)
4. **Response Formatting** - Structure and return processed content

### YouTube Transcript Extraction

1. **URL Validation** - Validate the provided YouTube URL format
2. **Page Fetching** - Fetch the YouTube video page HTML
3. **Data Extraction** - Parse HTML to extract transcript parameters
4. **API Request** - Make request to YouTube's internal transcript API
5. **Transcript Processing** - Format and return the transcript

## 🚨 Error Handling

The API handles various error scenarios gracefully:

- **Validation Errors**: Invalid input data or malformed requests
- **AI Service Errors**: Gemini API failures or rate limits
- **YouTube Errors**: Videos without transcripts or parsing failures
- **Network Errors**: Connection timeouts and network issues
- **Server Errors**: Internal server errors with proper logging

## 📝 API Testing

### REST Client (VS Code)

Use the provided `api-tests.rest` file with REST Client extension to test all API endpoints.

### Manual Testing

```bash
# Health check
curl http://localhost:3001/api/health

# Extract transcript
curl "http://localhost:3001/api/transcript?url=https://www.youtube.com/watch?v=VIDEO_ID"

# Process transcript
curl -X POST http://localhost:3001/api/process \
  -H "Content-Type: application/json" \
  -d '{"transcript":"Your transcript here","purpose":"learning"}'
```

## 🔄 Rate Limiting

The API implements configurable rate limiting:

- **Default**: 100 requests per 15 minutes
- **Configurable**: Adjustable via environment variables
- **Headers**: Rate limit information included in response headers
- **Graceful Degradation**: Clear error messages when limits exceeded

## 🛡️ CORS Configuration

CORS is configured to allow cross-origin requests:

- **Development**: Allows localhost origins
- **Production**: Configurable allowed origins
- **Methods**: Supports GET, POST, OPTIONS
- **Headers**: Allows common headers including Content-Type

## 📊 Performance

### Optimization Features

- **Connection Pooling**: Efficient database connections (if applicable)
- **Response Caching**: Intelligent caching of AI responses
- **Async Processing**: Non-blocking I/O operations
- **Memory Management**: Proper garbage collection and memory usage

### Monitoring

- **Request Logging**: Comprehensive request/response logging
- **Performance Metrics**: Response time and throughput monitoring
- **Error Tracking**: Detailed error logging and reporting

## 🚀 Deployment

### Production Considerations

- **Environment Variables**: Secure configuration management
- **Process Management**: PM2 or similar for process monitoring
- **Reverse Proxy**: Nginx or Apache for load balancing
- **SSL/TLS**: HTTPS encryption for production
- **Monitoring**: Application performance monitoring

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure security best practices are followed

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Google Generative AI Documentation](https://ai.google.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Jest Testing Framework](https://jestjs.io/)

---

**Part of the YouTube to Social Post AI Processing App**
