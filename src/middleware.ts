import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Protect /admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("sb-access-token")?.value
    if (!token) {
      const url = new URL("/admin/login", req.url)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
