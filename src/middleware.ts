import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const isLoggedIn = req.cookies.get('refresh-token');
    const { pathname } = req.nextUrl;
    if (pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/dashboard') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}
export const config = { matcher: ['/login', '/dashboard/:path*'], };