import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!pathname.startsWith("/admin")) return NextResponse.next()

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/logout"
  if (isAuthPage) return NextResponse.next()

  const hasToken = !!req.cookies.get("sb-access-token")?.value
  if (!hasToken) return NextResponse.redirect(new URL("/admin/login", req.url))

  return NextResponse.next()
}

export const config = { matcher: ["/admin/:path*"] }
