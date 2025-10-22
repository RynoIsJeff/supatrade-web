import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const supabase = supabaseServer()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) return new Response("Unauthorized", { status: 401 })

  const { access_token, refresh_token } = data.session

  // 👇 await cookies() in Next 16
  const c = await cookies()
  c.set("sb-access-token", access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
  c.set("sb-refresh-token", refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return new Response("ok")
}
