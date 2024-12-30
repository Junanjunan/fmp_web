import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function authMiddleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('next-auth.session-token')?.value;

  if (isAuthenticated && (
    request.nextUrl.pathname === '/auth/login' ||
    request.nextUrl.pathname === '/auth/signup'
  )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}