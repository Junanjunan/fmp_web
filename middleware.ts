import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from '@/lib/middleware/auth'


// Helper function to chain middleware
const chainMiddleware = (
  request: NextRequest,
  middlewares: ((req: NextRequest) => Promise<NextResponse> | NextResponse)[]
) => {
  return middlewares.reduce(async (promise, middleware) => {
    const response = await promise;
    if (response.headers.get('location')) {
      return response;
    }
    return middleware(request);
  }, Promise.resolve(NextResponse.next()));
}

// main middleware:
// add middlewares to be executed in the chainMiddleware array.
export async function middleware(request: NextRequest) {
  return chainMiddleware(request, [
    authMiddleware,
  ]);
}

export const config = {
  matcher: [
    '/auth/login',
    '/auth/signup',
  ]
}