import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const authToken = request.cookies.get('authToken');

  const AUTH_URLS = ['/auth/login', '/auth/forgot-password'];

  if (authToken && AUTH_URLS.includes(url.pathname)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!authToken && !AUTH_URLS.includes(url.pathname)) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/users') {
    url.pathname = '/users/children';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
