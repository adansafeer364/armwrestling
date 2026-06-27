import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Example Role-Based Access Control
    if (path.startsWith('/admin') && token?.role !== 'Admin' && token?.role !== 'Super Admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/referee') && token?.role !== 'Referee' && token?.role !== 'Admin' && token?.role !== 'Super Admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/athlete-dashboard') && !token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/referee/:path*', '/athlete-dashboard/:path*'],
};