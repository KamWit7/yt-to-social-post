# YouTube to Social Post - AI Processing App

A comprehensive application for processing YouTube transcripts using AI (Google Gemini) and generating various types of content for different purposes.

## 🚀 Features

- **Transcript Processing**: Paste YouTube video transcripts for AI analysis
- **Purpose Selection**: Choose processing goals (learning, work, content creation, general)
- **AI-Powered Content Generation**:
  - Summary (always generated)
  - Key topics (always generated)
  - Mind map (optional for learning purposes)
  - Social media post (optional for content creation)
  - Custom instructions (for general purposes)

## 🏗️ Project Structure

```
yt-to-social-post/
├── yt-scribe/              # Frontend (Next.js 15)
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # UI Components
│   │   ├── lib/            # Utilities and configurations
│   │   └── types/          # TypeScript type definitions
├── backend/                 # Backend API (Express.js)
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic services
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── types/          # TypeScript definitions
├── docs/                    # Documentation
└── .github/                 # GitHub workflows and templates
```

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching and caching
- **Radix UI** - Accessible component primitives

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Google Generative AI** - Gemini AI integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Rate Limiting** - API abuse prevention

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key (for AI processing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd yt-to-social-post
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Add your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd yt-scribe
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Input Transcript**: Paste a YouTube video transcript
3. **Select Purpose**: Choose your processing goal
4. **Configure Options**:
   - **Learning**: Check "Generate mind map"
   - **Content Creation**: Check "Generate social media post"
   - **General**: Enter custom instructions
5. **Generate Content**: Click "Generate" and wait for AI processing
6. **Copy Results**: Use the copy button to save to clipboard

## 🔌 API Endpoints

### Backend API (`http://localhost:3001`)

- `GET /api/transcript` - Extract YouTube transcript
- `POST /api/process` - Process transcript with AI
- `GET /api/health` - Health check

### Frontend Configuration

Set `NEXT_PUBLIC_API_URL` in your environment (defaults to `http://localhost:3001`)

## 🧪 Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm test            # Run tests
npm run lint        # Lint code
npm run lint:fix    # Fix linting issues
```

### Frontend Development

```bash
cd yt-scribe
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Lint code
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:endpoints     # API endpoint tests
npm run test:integration   # Integration tests
```

### Frontend Tests

```bash
cd yt-scribe
npm test                   # Run tests
npm run test:watch         # Watch mode
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: API abuse prevention
- **Input Validation**: URL and data validation
- **Error Handling**: Comprehensive error management

## 🌍 Environment Variables

### Backend (`.env`)

```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 Documentation

- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./yt-scribe/README.md)
- [API Testing Guide](./backend/api-tests.rest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Review the documentation
3. Create a new issue with detailed information

## 🔄 Updates

Stay updated with the latest changes by:

- Watching the repository
- Checking the [Releases](../../releases) page
- Following the [CHANGELOG](CHANGELOG.md)

---

**Built with ❤️ using Next.js, Express.js, and Google Gemini AI**
