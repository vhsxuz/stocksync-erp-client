// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isPublic = publicPaths.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (token) {
    const user = await verifyJWT(token); // must await now

    if (!user && !isPublic) {
      const res = NextResponse.redirect(new URL('/auth/login', request.url));
      return res;
    }

    if (user && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*', '/items/:path*'],
};
