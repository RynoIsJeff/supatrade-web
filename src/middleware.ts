import { NextResponse, type NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const url = new URL(req.nextUrl)
  const isAdminArea = url.pathname.startsWith("/admin")
  if (!isAdminArea) return NextResponse.next()

  const hasSession = Boolean(req.cookies.get("sb-access-token")?.value)
  const isLogin = url.pathname.startsWith("/admin/login")
  if (!hasSession && !isLogin) {
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }
  if (hasSession && isLogin) {
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ["/admin/:path*"] }
