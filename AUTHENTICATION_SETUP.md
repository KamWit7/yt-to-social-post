# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (if using Prisma adapter)
DATABASE_URL=your-database-url-here
```

## Required Environment Variables

### NEXTAUTH_SECRET

Generate a random secret key for NextAuth:

```bash
openssl rand -base64 32
```

### NEXTAUTH_URL

Set to your application URL:

- Development: `http://localhost:3000`
- Production: Your actual domain

### Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Copy Client ID and Client Secret

## Demo Credentials

For testing purposes, you can use these demo credentials:

- Email: `demo@example.com`
- Password: `password`

## Features Implemented

✅ NextAuth.js configuration with JWT strategy  
✅ Credentials provider (email/password)  
✅ Google OAuth provider  
✅ Login/Register forms with validation  
✅ User profile management  
✅ Session-based navigation  
✅ Logout functionality  
✅ Protected routes support

## Usage

1. Start the development server: `npm run dev`
2. Navigate to `/login` to sign in
3. Navigate to `/register` to create an account
4. Navigate to `/profile` to view user profile (requires authentication)

## Next Steps

- Set up database integration with Prisma
- Implement user registration backend
- Add password reset functionality
- Add email verification
- Implement usage tracking for free tier limits
