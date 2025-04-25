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

const corsMiddleware = (request: NextRequest) => {
  const response = NextResponse.next();
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://taltalstock.shop',
    'https://www.taltalstock.shop',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

// main middleware:
// add middlewares to be executed in the chainMiddleware array.
export async function middleware(request: NextRequest) {
  return chainMiddleware(request, [
    corsMiddleware,
    authMiddleware,
  ]);
}

export const config = {
  matcher: [
    '/auth/login',
    '/auth/signup',
  ]
}