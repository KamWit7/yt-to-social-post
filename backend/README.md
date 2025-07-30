# YouTube Transcript Backend API

Backend API for extracting transcripts from YouTube videos without requiring YouTube Data API v3 keys. This service directly parses YouTube pages to extract transcript data.

## 🚀 Technologies Used

### Backend Stack

- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Nodemon** - Development server with hot reload

### Security & Middleware

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limiter** - Request rate limiting
- **Input Validation** - URL validation and sanitization

### Development Tools

- **TypeScript Compiler** - Type checking and compilation
- **Supertest** - API testing
- **REST Client** - API testing (VS Code extension)

## 🚀 Installation

```bash
cd backend
npm install
```

## 🔧 Configuration

1. Create a `.env` file (optional - no API keys required):

```bash
cp .env.example .env
```

2. Configure environment variables (optional):

```env
PORT=3001
NODE_ENV=development
```

**Note:** This API doesn't require YouTube Data API v3 keys as it directly parses YouTube pages.

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

### GET /api/transcript

Extracts transcript from a YouTube video by parsing the video page directly.

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

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
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

- **Helmet** - Adds security headers
- **CORS** - Configurable cross-origin requests
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Validates YouTube URLs
- **Error Handling** - Comprehensive error management

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # API controllers
│   ├── services/             # Business logic
│   │   ├── youtube.service.ts
│   │   ├── youtube-transcript-orchestrator.service.ts
│   │   └── health.service.ts
│   ├── parsers/              # HTML and transcript parsing
│   ├── middleware/           # Express middleware
│   ├── routes/               # API routes
│   ├── types/                # TypeScript type definitions
│   ├── interfaces/           # Service interfaces
│   ├── utils/                # Utility functions
│   ├── cors/                 # CORS configuration
│   └── server.ts             # Main server file
├── tests/                    # Test files
├── scripts/                  # Utility scripts
├── api-tests.rest           # REST Client test file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 How It Works

1. **URL Validation** - Validates the provided YouTube URL
2. **Page Fetching** - Fetches the YouTube video page HTML
3. **Data Extraction** - Parses HTML to extract transcript parameters
4. **API Request** - Makes request to YouTube's internal API
5. **Transcript Processing** - Formats and returns the transcript

## 🚨 Error Handling

The API handles various error scenarios:

- Invalid YouTube URLs
- Videos without transcripts
- Network errors
- YouTube API errors
- Malformed requests

## 📝 API Testing

Use the provided `api-tests.rest` file with REST Client extension in VS Code to test the API endpoints.

## 🔄 Rate Limiting

The API implements rate limiting to prevent abuse. Default limits are configured in the middleware.

## 🛡️ CORS Configuration

CORS is configured to allow cross-origin requests. Configuration can be found in `src/cors/cors.config.ts`.
