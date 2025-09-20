import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // For now, let the individual pages handle authentication
  // This prevents the Auth0 middleware from interfering with custom auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific API routes that need Auth0
    '/api/emotions/:path*',
    '/api/suggestions/:path*'
  ]
};
