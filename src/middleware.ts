import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const isLoggedIn = req.cookies.get('refresh-token');
    const { pathname } = req.nextUrl;
    if (pathname === '/login/:path*' && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/dashboard') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login/admin', req.url));
    }
    return NextResponse.next();
}
export const config = { matcher: ['/login/:path*', '/dashboard/:path*'], };