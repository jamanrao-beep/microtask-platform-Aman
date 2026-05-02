// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Redirect admin trying to access worker routes
    if (pathname.startsWith('/worker') && token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // Redirect worker trying to access admin routes
    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/worker/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        if (pathname.startsWith('/worker') || pathname.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/worker/:path*', '/admin/:path*'],
}
