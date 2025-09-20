import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/api/emotions/:path*',
    '/api/suggestions/:path*',
    '/api/user/:path*'
  ]
};
