import { NextRequest, NextResponse } from 'next/server'

export const HEADERS_PATH_KEY = 'x-pathname'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const requestHeaders = new Headers(request.headers)

  requestHeaders.set(HEADERS_PATH_KEY, pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// // Configure which paths the middleware should run on
// export const config = {
//   matcher: ['/profile', '/usage'],
// }
