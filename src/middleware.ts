import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  const session = request.cookies.get('trace_session')?.value

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/' && session) {
    try {
      const user = JSON.parse(session)
      const role = user?.roles?.name
      if (role === 'OPERATOR') return NextResponse.redirect(new URL('/operator', request.url))
      if (role === 'QC') return NextResponse.redirect(new URL('/qc', request.url))
      if (role === 'SUPERVISOR') return NextResponse.redirect(new URL('/dashboard', request.url))
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url))
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
