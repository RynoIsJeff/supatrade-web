import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdmin = pathname.startsWith("/admin")
  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/logout"

  if (isAdmin && !isAuthPage) {
    const token = req.cookies.get("sb-access-token")?.value
    if (!token) {
      const url = new URL("/admin/login", req.url)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

// keep matcher broad, logic above excludes /admin/login explicitly
export const config = {
  matcher: ["/admin/:path*"],
}
