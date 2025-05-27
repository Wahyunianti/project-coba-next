import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (isLoggedIn !== 'true') {
      // Redirect ke login jika belum login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Terapkan middleware hanya ke route yang butuh proteksi
export const config = {
  matcher: ['/admin/:path*'],
};
