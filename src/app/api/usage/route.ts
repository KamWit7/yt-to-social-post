import { resetAllFreeTierUsage } from '@/lib/db/usage'
import { serverEnv } from '@/lib/env/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (
    serverEnv.NODE_ENV !== 'development' &&
    authHeader !== `Bearer ${serverEnv.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  try {
    const updated = await resetAllFreeTierUsage()
    return Response.json({ success: true, updated })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error : 'Failed to reset usage',
      },
      { status: 500 }
    )
  }
}
