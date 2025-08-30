# YouTube to Social Post - Frontend

This is the frontend application for the YouTube to Social Post AI processing app, built with Next.js 15 and React 19.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive interface built with Tailwind CSS
- **Transcript Input**: Easy-to-use form for pasting YouTube transcripts
- **Purpose Selection**: Intuitive interface for choosing processing goals
- **AI Integration**: Seamless connection to Google Gemini AI backend
- **Real-time Processing**: Live feedback during AI content generation
- **Copy to Clipboard**: One-click copying of generated content
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling with validation
- **TanStack Query** - Powerful data fetching and caching
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful, customizable icons

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see [Backend README](../backend/README.md))

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Note**: The backend must be running for the frontend to work properly.

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
yt-scribe/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   ├── forms/              # Form components
│   │   └── layout/             # Layout components
│   ├── lib/                    # Utilities and configurations
│   │   ├── api.ts              # API client configuration
│   │   ├── utils.ts            # Utility functions
│   │   └── validations.ts      # Form validation schemas
│   └── types/                  # TypeScript type definitions
├── public/                      # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality

The project uses:

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework

## 🎨 UI Components

### Core Components

- **TranscriptForm** - Main form for transcript input and processing
- **PurposeSelector** - Radio button group for selecting processing goals
- **OptionsPanel** - Conditional options based on selected purpose
- **ProcessingStatus** - Loading states and progress indicators
- **ResultsDisplay** - Formatted output of AI-generated content
- **CopyButton** - One-click copying to clipboard

### Design System

- **Color Palette**: Consistent color scheme with dark/light mode support
- **Typography**: Modern, readable font stack
- **Spacing**: Consistent spacing scale using Tailwind's spacing system
- **Components**: Reusable, accessible component library

## 🔌 API Integration

### Backend Communication

The frontend communicates with the backend through:

- **REST API**: HTTP endpoints for transcript processing
- **Real-time Updates**: Live status updates during processing
- **Error Handling**: Comprehensive error handling and user feedback

### API Endpoints Used

- `POST /api/process` - Process transcript with AI
- `GET /api/health` - Health check (optional)

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with side-by-side layout
- **Tablet**: Adaptive layout with optimized touch interactions
- **Mobile**: Mobile-first design with touch-friendly controls

## 🧪 Testing

### Test Structure

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: Full user journey testing

### Running Tests

```bash
npm test                   # Run all tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Self-hosted**: Docker or traditional hosting

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## 🔧 Configuration

### Tailwind CSS

Custom Tailwind configuration includes:

- Extended color palette
- Custom spacing scale
- Component-specific utilities
- Dark mode support

### TypeScript

Strict TypeScript configuration with:

- Strict mode enabled
- Path mapping for clean imports
- Comprehensive type definitions

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure responsive design works on all devices

## 🆘 Troubleshooting

### Common Issues

1. **Backend Connection**: Ensure backend is running on correct port
2. **Environment Variables**: Check `.env.local` configuration
3. **Build Errors**: Clear `.next` folder and reinstall dependencies

### Getting Help

- Check the [Issues](../../issues) page
- Review the [Backend README](../backend/README.md)
- Create a new issue with detailed information

---

**Part of the YouTube to Social Post AI Processing App**
