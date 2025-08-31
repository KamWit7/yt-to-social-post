import { app } from '../src/server'

// Export the Express app for Vercel serverless
// Don't call app.listen() - Vercel handles this
export default app
