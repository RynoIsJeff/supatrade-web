import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /admin but allow API endpoints through
  if (!pathname.startsWith("/admin")) return NextResponse.next()
  if (pathname.startsWith("/admin/api")) return NextResponse.next() // <-- allow login/logout

  const hasSession = Boolean(req.cookies.get("sb-access-token")?.value)
  const isLoginPage = pathname.startsWith("/admin/login")

  if (!hasSession && !isLoginPage) {
    const url = new URL("/admin/login", req.url)
    return NextResponse.redirect(url)
  }
  if (hasSession && isLoginPage) {
    const url = new URL("/admin", req.url)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

// Keep this simple matcher
export const config = { matcher: ["/admin/:path*"] }
