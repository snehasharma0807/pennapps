import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // For now, let the individual pages handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only protect specific API routes
    '/api/emotions/:path*',
    '/api/suggestions/:path*'
  ]
};
