// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/leads') ||
        request.nextUrl.pathname.startsWith('/landing-pages') ||
        request.nextUrl.pathname.startsWith('/settings')

    // Redireciona para login se tentar acessar rota protegida sem token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redireciona para dashboard se já estiver autenticado e tentar acessar login/signup
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/leads/:path*',
        '/landing-pages/:path*',
        '/settings/:path*',
        '/login',
        '/signup',
    ],
}